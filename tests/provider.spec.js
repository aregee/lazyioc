const o = require("ospec");
const { LazyIoc } = require("../bundle");

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
        this.lazyIoc = new LazyIoc("providerTest");
        console.error = spyOn(console.error);
        // this.spy = console.error;
        this.lazyIoc.provider("same.name", function() {
          this.$get = function(container) {
            return function() {
              return "hello World";
            };
          };
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          this.lazyIoc.provider("same.name", function() {});
          expect(console.error.callCount).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          console.error = spyOn(console.error);
          this.lazyIoc.container.same.name();
        });
        it("logs an error", function() {
          this.lazyIoc.provider("same.name", function() {});
          expect(this.lazyIoc.container.same).notEquals(undefined);
          expect(this.lazyIoc.container.same.name).notEquals(undefined);
          expect(console.error.callCount).notEquals(0);
        });
      });
    });

    it("creates a provider instance on the container", function() {
      const shell = new LazyIoc();
      const EntityProvider = function() {};
      shell.provider("Entity", EntityProvider);
      expect(shell.container.EntityProvider instanceof EntityProvider).equals(
        true
      );
    });

    it("lazily creates the provider when accessed", function() {
      let i = 0;
      const shell = new LazyIoc();
      shell.provider("Entity", function() {
        i = ++i;
      });
      expect(i).equals(0);
      expect(shell.container.EntityProvider).notEquals(undefined);
      expect(i).equals(1);
    });
    it("uses the $get method to create services, and passes a container", function() {
      this.lazyIoc = new LazyIoc();
      const Entity = function() {};
      const entityProvider = function() {
        return new Entity();
      };
      const entitySpy = spyOn(entityProvider);
      const EntityProvider = function() {
        this.$get = entitySpy;
      };
      this.lazyIoc.provider("Entity", EntityProvider);
      const provider = this.lazyIoc.container.EntityProvider;
      expect(this.lazyIoc.container.Entity instanceof Entity).equals(true);
      expect(provider.$get.callCount).equals(1);
    });

    describe("when $get throws an error", function() {
      clone.beforeEach(function() {
        this.lazyIoc = new LazyIoc();
        this.e = new Error();
        const entityProvider = function() {
          throw this.e;
        };
        this.$getSpy = spyOn(entityProvider);
        let $getSpy = this.$getSpy;
        this.lazyIoc.provider("thrower", function() {
          this.$get = $getSpy;
        });
      });
      describe("getting the service from the container", function() {
        it("throws the error", function() {
          let context = this;
          expect(
            (function() {
              return context.lazyIoc.container.thrower;
            })()
          ).equals(this.e);
        });
        it("continues to throw the error for subsequent requests", function() {
          let context = this;
          expect(
            (function() {
              return context.lazyIoc.container.thrower;
            })()
          ).equals(this.e);
          expect(
            (function() {
              return context.lazyIoc.container.thrower;
            })()
          ).equals(this.e);
        });
        describe("when $get stops throwing an error", function() {
          clone.beforeEach(function() {
            this.value = "OK";
            const entityProvider = function() {
              return this.value;
            };
            this.$getSpy = spyOn(entityProvider.bind(this));
          });
          it("no longer throws the error", function() {
            let context = this;
            expect(
              (function() {
                return context.lazyIoc.container.thrower;
              })()
            ).notEquals(this.e);
          });
          it("returns the service", function() {
            expect(this.lazyIoc.container.thrower).equals(this.value);
          });
        });
      });
    });
    it("lazily creates the service it provides", function() {
      let i = 0;
      const Entity = function() {
        i++;
      };
      const EntityProvider = function() {
        this.$get = function() {
          return new Entity();
        };
      };
      this.lazyIoc = new LazyIoc();
      this.lazyIoc.provider("Entity", EntityProvider);
      expect(i).equals(0);
      expect(this.lazyIoc.container.Entity instanceof Entity).equals(true);
      expect(i).equals(1);
    });

    it("removes the provider after the service is accessed", function() {
      this.lazyIoc = new LazyIoc();
      this.lazyIoc.provider("Entity", function() {
        this.$get = function() {
          return "test";
        };
      });
      expect(this.lazyIoc.container.EntityProvider).notEquals(undefined);
      expect(this.lazyIoc.container.Entity).notEquals(undefined);
      expect(this.lazyIoc.container.EntityProvider).equals(undefined);
    });

    it("should nest lazyioc containers if the service name uses dot notation", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      console.error = spyOn(console.error);
      const EntityProvider = function() {
        this.$get = function() {
          return new Entity();
        };
      };
      lazyioc.provider("Generic.Entity", EntityProvider);
      expect(lazyioc.container.Generic).notEquals(undefined);
      expect(lazyioc.container.Generic.EntityProvider).notEquals(undefined);
      expect(lazyioc.container.Generic.Entity).notEquals(undefined);
      expect(console.error.callCount).equals(0);
    });

    it("does not log an error if a service is added to a nested lazyioc with initialized services", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      const EntityProvider = function() {
        this.$get = function() {
          return new Entity();
        };
      };
      console.error = spyOn(console.error);
      lazyioc.provider("Some.Entity", EntityProvider);
      expect(lazyioc.container.Some).notEquals(undefined);
      expect(lazyioc.container.Some.Entity).notEquals(undefined);
      lazyioc.provider("Some.OtherEntity", EntityProvider);
      expect(lazyioc.container.Some.OtherEntity).notEquals(undefined);
      expect(console.error.callCount).equals(0);
    });

    it("Allows falsey values returned by $get to remain defined when accessed multiple times", function() {
      const lazyIoc = new LazyIoc();
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

      lazyIoc
        .provider("Nully", NullyProvider)
        .provider("Empty", EmptyProvider)
        .provider("Falsey", FalseyProvider)
        .provider("Zero", ZeroProvider);

      expect(lazyIoc.container.Nully).equals(null);
      expect(lazyIoc.container.Nully).equals(null);
      expect(lazyIoc.container.Empty).equals("");
      expect(lazyIoc.container.Empty).equals("");
      expect(lazyIoc.container.Falsey).equals(false);
      expect(lazyIoc.container.Falsey).equals(false);
      expect(lazyIoc.container.Zero).equals(0);
      expect(lazyIoc.container.Zero).equals(0);
    });

    describe("lazyioc#resetProviders", function() {
      it("allows for already instantiated providers to be reset back to their registry", function() {
        let i = 0;
        const lazyIoc = new LazyIoc();
        const EntityProvider = function() {
          i = ++i;
          this.$get = function() {
            return this;
          };
        };
        lazyIoc.provider("Entity", EntityProvider);
        expect(lazyIoc.container.Entity instanceof EntityProvider).equals(true);
        // Intentionally calling twice to prove the construction is cached until reset
        expect(lazyIoc.container.Entity instanceof EntityProvider).equals(true);
        lazyIoc.resetProviders();
        expect(lazyIoc.container.Entity instanceof EntityProvider).equals(true);
        expect(i).equals(2);
      });
      it("allows for selectively resetting providers by name", function() {
        let i = 0;
        let j = 0;
        const lazyIoc = new LazyIoc();
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
        lazyIoc.provider("First", FirstProvider);
        lazyIoc.provider("Second", SecondProvider);
        expect(lazyIoc.container.First instanceof FirstProvider).equals(true);
        expect(lazyIoc.container.Second instanceof SecondProvider).equals(
          true
        );
        expect(i).equals(1);
        expect(j).equals(1);
        lazyIoc.resetProviders(["First"]);
        expect(lazyIoc.container.First instanceof FirstProvider).equals(true);
        expect(lazyIoc.container.Second instanceof SecondProvider).equals(
          true
        );
        expect(i).equals(2);
        expect(j).equals(1);
      });
      it("allows for sub containers to re-initiate as well", function() {
        let i = 0;
        const lazyIoc = new LazyIoc();
        const EntityProvider = function() {
          i = ++i;
          this.$get = function() {
            return this;
          };
        };
        lazyIoc.provider("Entity.Someentity", EntityProvider);
        expect(
          lazyIoc.container.Entity.Someentity instanceof EntityProvider
        ).equals(true);
        // Intentionally calling twice to prove the construction is cached until reset
        expect(
          lazyIoc.container.Entity.Someentity instanceof EntityProvider
        ).equals(true);
        lazyIoc.resetProviders();
        expect(
          lazyIoc.container.Entity.Someentity instanceof EntityProvider
        ).equals(true);
        expect(i).equals(2);
      });
      it("should not break if a nested container has multiple children", function() {
        const lazyIoc = new LazyIoc();
        lazyIoc.service("Entity.A", function() {
          this.name = "A";
        });
        lazyIoc.service("Entity.B", function() {
          this.name = "B";
        });
        expect(lazyIoc.container.Entity.A.name).equals("A");
        expect(lazyIoc.container.Entity.B.name).equals("B");
        lazyIoc.resetProviders();
        expect(lazyIoc.container.Entity.A.name).equals("A");
        expect(lazyIoc.container.Entity.B.name).equals("B");
      });
      it("allows for services with dependencies to be re-initiated with fresh instances", function() {
        let i = 0;
        const lazyIoc = new LazyIoc();
        const Entity = function(dep) {
          this.dep = dep;
        };
        const Dep = function() {
          this.i = ++i;
        };
        let dep1 = new Dep();
        let dep2 = new Dep();
        let depStack = [dep1, dep2];
        lazyIoc.service("Entity", Entity, "Dep");
        lazyIoc.factory("Dep", function() {
          return depStack.shift();
        });
        expect(lazyIoc.container.Entity instanceof Entity).equals(true)(
          "services should be reinitiated on resetProviders call"
        );
        expect(lazyIoc.container.Entity.dep).equals(dep1)(
          "services should be reinitiated on resetProviders call"
        );
        lazyIoc.resetProviders();
        expect(lazyIoc.container.Entity instanceof Entity).equals(true)(
          "services should be reinitiated on resetProviders call"
        );
        expect(lazyIoc.container.Entity.dep).equals(dep2)(
          "services should be reinitiated on resetProviders call"
        );
      });
    });
  });
  clone.run();
}(o);
