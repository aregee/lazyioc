const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * Bottle Factory test suite
   */
  describe("Bottle#service", function() {
    describe("when the same key is used twice", function() {
      clone.beforeEach(function() {
        this.lazyioc = new AppShell();
        this.spy = spyOn(console.error);
        console.error = this.spy;
        this.lazyioc.service("same.name", function() {
          return function() {};
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          this.lazyioc.service("same.name", function() {});
          expect(this.spy.callCount).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          this.lazyioc.container.same.name();
        });
        it("logs an error", function() {
          this.lazyioc.service("same.name", function() {});
          expect(this.spy.callCount).notEquals(0);
        });
      });
    });
    it("creates a provider and service instance on the container", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      lazyioc.service("SomeThing", Thing);
      expect(lazyioc.container.SomeThingProvider).notEquals(undefined);
      expect(lazyioc.container.SomeThing).notEquals(undefined);
    });
    it("injects dependencies by passing them as string keys", function() {
      const lazyioc = new AppShell();
      const Thing = function(foo, bar) {
        this.foo = foo;
        this.bar = bar;
      };
      lazyioc.service("Thing", Thing, "foo", "bar");
      lazyioc.service("foo", function() {
        this.name = "foo";
      });
      lazyioc.value("bar", "bippity");

      expect(lazyioc.container.Thing).notEquals(undefined);
      expect(lazyioc.container.Thing.foo).notEquals(undefined);
      expect(lazyioc.container.Thing.foo.name).equals("foo");
      expect(lazyioc.container.Thing.bar).equals("bippity");
    });

    it("will nest bottle containers if the service name uses dot notation", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      lazyioc.service("Util.Thing", Thing);
      expect(lazyioc.container.Util).notEquals(undefined);
      expect(lazyioc.container.Util.ThingProvider).notEquals(undefined);
      expect(lazyioc.container.Util.Thing).notEquals(undefined);
    });

    it("can resolve dot-notation dependencies", function() {
      const lazyioc = new AppShell();
      const Thing = function(sub) {
        this.sub = sub;
      };
      const SubThing = function() {};
      lazyioc.service("Thing", Thing, "Nest.SubThing");
      lazyioc.service("Nest.SubThing", SubThing);
      expect(lazyioc.container.Thing.sub).notEquals(undefined);
      expect(lazyioc.container.Thing.sub instanceof SubThing).equals(true);
    });

    describe("strict service resolution", function() {
      clone.beforeEach(function() {
        const lazyioc = new AppShell();
      });
      clone.afterEach(function() {
        lazyioc.config.strict = false;
      });
      it("will not care if a service is undefined when strict mode is off", function() {
        const Thing = function(phantom) {
          this.phantom = phantom;
        };

        lazyioc.config.strict = false;
        lazyioc.service("Thing", Thing, "PhantomService");
        expect(lazyioc.container.Thing).notEquals(undefined);
        expect(lazyioc.container.Thing.phantom).equals(undefined);
      });
      it("will throw an exception if a service is undefined in strict mode", function() {
        const Thing = function(phantom) {
          this.phantom = phantom;
        };

        lazyioc.config.strict = true;
        lazyioc.service("AnotherThing", Thing, "PhantomService");

        const test = function() {
          return lazyioc.container.AnotherThing;
        };
        try {
          test();
        } catch (error) {
          expect(error.message.includes("PhantomService")).equals(true);
        }
      });
    });
  });

  clone.run();
}(o);
