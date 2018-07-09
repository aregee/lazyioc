const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * lazyioc Provider test suite
   */
  describe("lazyioc#provider", function() {
    describe("when the same key is used twice", function() {
      clone.beforeEach(function() {
        this.appShell = new AppShell("providerTest");
        let logger = {};
        logger.count = 0;
        logger.error = err => {
          console.count++;
          // console.log(err);
        };

        Object.assign(console, logger);
        this.spy = spyOn(console.error);
        this.appShell.provider("same.name", function() {
          this.$get = function(container) {
            return function() {
              return "hello World";
            };
          };
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          let countBefore = this.spy.callCount;
          this.appShell.provider("same.name", function() {});
          let countAfter = this.spy.callCount;
          expect(countBefore).equals(countAfter);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          this.appShell.container.same.name();
        });
        it("logs an error", function() {
          let countBefore = console.count;
          this.appShell.provider("same.name", function() {});
          let countAfter = console.count;
          expect(this.appShell.container.same).notEquals(undefined);
          expect(this.appShell.container.same.name).notEquals(undefined);
          expect(countBefore).notEquals(countAfter);
        });
      });
    });

    it("creates a provider instance on the container", function() {
      const shell = new AppShell();
      const ThingProvider = function() {};
      shell.provider("Thing", ThingProvider);
      expect(shell.container.ThingProvider instanceof ThingProvider).equals(
        true
      );
    });

    it("lazily creates the provider when accessed", function() {
      let i = 0;
      const shell = new AppShell();
      shell.provider("Thing", function() {
        i = ++i;
      });
      expect(i).equals(0);
      expect(shell.container.ThingProvider).notEquals(undefined);
      expect(i).equals(1);
    });
    it("uses the $get method to create services, and passes a container", function() {
      this.appShell = new AppShell();
      const Thing = function() {};
      const thingProvider = function() {
        return new Thing();
      };
      const thingSpy = spyOn(thingProvider);
      const ThingProvider = function() {
        this.$get = thingSpy;
      };
      this.appShell.provider("Thing", ThingProvider);
      const provider = this.appShell.container.ThingProvider;
      expect(this.appShell.container.Thing instanceof Thing).equals(true);
      expect(provider.$get.callCount).equals(1);
    });

    describe("when $get throws an error", function() {
      clone.beforeEach(function() {
        this.appShell = new AppShell();
        this.e = new Error();
        const thingProvider = function() {
          throw this.e;
        };
        this.$getSpy = spyOn(thingProvider);
        let $getSpy = this.$getSpy;
        this.appShell.provider("thrower", function() {
          this.$get = $getSpy;
        });
      });
      describe("getting the service from the container", function() {
        it("throws the error", function() {
          let context = this;
          expect(
            (function() {
              return context.appShell.container.thrower;
            })()
          ).equals(this.e);
        });
        it("continues to throw the error for subsequent requests", function() {
          let context = this;
          expect(
            (function() {
              return context.appShell.container.thrower;
            })()
          ).equals(this.e);
          expect(
            (function() {
              return context.appShell.container.thrower;
            })()
          ).equals(this.e);
        });
        describe("when $get stops throwing an error", function() {
          clone.beforeEach(function() {
            this.value = "OK";
            const thingProvider = function() {
              return this.value;
            };
            this.$getSpy = spyOn(thingProvider.bind(this));
          });
          it("no longer throws the error", function() {
            let context = this;
            expect(
              (function() {
                return context.appShell.container.thrower;
              })()
            ).notEquals(this.e);
          });
          it("returns the service", function() {
            expect(this.appShell.container.thrower).equals(this.value);
          });
        });
      });
    });
    it("lazily creates the service it provides", function() {
      let i = 0;
      const Thing = function() {
        i++;
      };
      const ThingProvider = function() {
        this.$get = function() {
          return new Thing();
        };
      };
      this.appShell = new AppShell();
      this.appShell.provider("Thing", ThingProvider);
      expect(i).equals(0);
      expect(this.appShell.container.Thing instanceof Thing).equals(true);
      expect(i).equals(1);
    });

    it("removes the provider after the service is accessed", function() {
      this.appShell = new AppShell();
      this.appShell.provider("Thing", function() {
        this.$get = function() {
          return "test";
        };
      });
      expect(this.appShell.container.ThingProvider).notEquals(undefined);
      expect(this.appShell.container.Thing).notEquals(undefined);
      expect(this.appShell.container.ThingProvider).equals(undefined);
    });

    it("will nest lazyioc containers if the service name uses dot notation", function() {
      this.appShell = new AppShell();
      const Thing = function() {};
      const ThingProvider = function() {
        this.$get = function() {
          return new Thing();
        };
      };
      this.appShell.provider("Util.Thing", ThingProvider);
      expect(this.appShell.container.Util).notEquals(undefined);
      expect(this.appShell.container.Util.ThingProvider).notEquals(undefined);
      expect(this.appShell.container.Util.Thing).notEquals(undefined);
    });

    it("does not log an error if a service is added to a nested lazyioc with initialized services", function() {
      this.appShell = new AppShell();
      const Thing = function() {};
      const ThingProvider = function() {
        this.$get = function() {
          return new Thing();
        };
      };
      this.spy = spyOn(console.error);
      this.appShell.provider("Util.Thing", ThingProvider);
      expect(this.appShell.container.Util.Thing).notEquals(undefined);
      this.appShell.provider("Util.OtherThing", ThingProvider);
      expect(this.appShell.container.Util.OtherThing).notEquals(undefined);
      expect(this.spy.callCount).equals(0);
    });

    it("Allows falsey values returned by $get to remain defined when accessed multiple times", function() {
      const appShell = new AppShell();
      const NullyProvider = function() {
        this.$get = function() {
          return null;
        };
      };
      const EmptyProvider = function() {
        this.$get = function() {
          return "";
        };
      };
      const FalseyProvider = function() {
        this.$get = function() {
          return false;
        };
      };
      const ZeroProvider = function() {
        this.$get = function() {
          return 0;
        };
      };

      appShell
        .provider("Nully", NullyProvider)
        .provider("Empty", EmptyProvider)
        .provider("Falsey", FalseyProvider)
        .provider("Zero", ZeroProvider);

      expect(appShell.container.Nully).equals(null);
      expect(appShell.container.Nully).equals(null);
      expect(appShell.container.Empty).equals("");
      expect(appShell.container.Empty).equals("");
      expect(appShell.container.Falsey).equals(false);
      expect(appShell.container.Falsey).equals(false);
      expect(appShell.container.Zero).equals(0);
      expect(appShell.container.Zero).equals(0);
    });

    describe("lazyioc#resetProviders", function() {
      it("allows for already instantiated providers to be reset back to their registry", function() {
        let i = 0;
        const appShell = new AppShell();
        const ThingProvider = function() {
          i = ++i;
          this.$get = function() {
            return this;
          };
        };
        appShell.provider("Thing", ThingProvider);
        expect(appShell.container.Thing instanceof ThingProvider).equals(true);
        // Intentionally calling twice to prove the construction is cached until reset
        expect(appShell.container.Thing instanceof ThingProvider).equals(true);
        appShell.resetProviders();
        expect(appShell.container.Thing instanceof ThingProvider).equals(true);
        expect(i).equals(2);
      });
      it("allows for selectively resetting providers by name", function() {
        let i = 0;
        let j = 0;
        const appShell = new AppShell();
        const FirstProvider = function() {
          i = ++i;
          this.$get = function() {
            return this;
          };
        };
        const SecondProvider = function() {
          j = ++j;
          this.$get = function() {
            return this;
          };
        };
        appShell.provider("First", FirstProvider);
        appShell.provider("Second", SecondProvider);
        expect(appShell.container.First instanceof FirstProvider).equals(true);
        expect(appShell.container.Second instanceof SecondProvider).equals(
          true
        );
        expect(i).equals(1);
        expect(j).equals(1);
        appShell.resetProviders(["First"]);
        expect(appShell.container.First instanceof FirstProvider).equals(true);
        expect(appShell.container.Second instanceof SecondProvider).equals(
          true
        );
        expect(i).equals(2);
        expect(j).equals(1);
      });
      it("allows for sub containers to re-initiate as well", function() {
        let i = 0;
        const appShell = new AppShell();
        const ThingProvider = function() {
          i = ++i;
          this.$get = function() {
            return this;
          };
        };
        appShell.provider("Thing.Something", ThingProvider);
        expect(
          appShell.container.Thing.Something instanceof ThingProvider
        ).equals(true);
        // Intentionally calling twice to prove the construction is cached until reset
        expect(
          appShell.container.Thing.Something instanceof ThingProvider
        ).equals(true);
        appShell.resetProviders();
        expect(
          appShell.container.Thing.Something instanceof ThingProvider
        ).equals(true);
        expect(i).equals(2);
      });
      it("will not break if a nested container has multiple children", function() {
        const appShell = new AppShell();
        appShell.service("Thing.A", function() {
          this.name = "A";
        });
        appShell.service("Thing.B", function() {
          this.name = "B";
        });
        expect(appShell.container.Thing.A.name).equals("A");
        expect(appShell.container.Thing.B.name).equals("B");
        appShell.resetProviders();
        expect(appShell.container.Thing.A.name).equals("A");
        expect(appShell.container.Thing.B.name).equals("B");
      });
      it("allows for services with dependencies to be re-initiated with fresh instances", function() {
        let i = 0;
        const appShell = new AppShell();
        const Thing = function(dep) {
          this.dep = dep;
        };
        const Dep = function() {
          this.i = ++i;
        };
        let dep1 = new Dep();
        let dep2 = new Dep();
        let depStack = [dep1, dep2];
        appShell.service("Thing", Thing, "Dep");
        appShell.factory("Dep", function() {
          return depStack.shift();
        });
        expect(appShell.container.Thing instanceof Thing).equals(true)(
          "services should be reinitiated on resetProviders call"
        );
        expect(appShell.container.Thing.dep).equals(dep1)(
          "services should be reinitiated on resetProviders call"
        );
        appShell.resetProviders();
        expect(appShell.container.Thing instanceof Thing).equals(true)(
          "services should be reinitiated on resetProviders call"
        );
        expect(appShell.container.Thing.dep).equals(dep2)(
          "services should be reinitiated on resetProviders call"
        );
      });
    });
  });
  clone.run();
}(o);
