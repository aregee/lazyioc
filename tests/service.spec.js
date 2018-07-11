const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * LazyIoc Factory test suite
   */
  describe("LazyIoc#service", function() {
    describe("when the same key is used twice", function() {
      clone.beforeEach(function() {
        this.lazyioc = new LazyIoc();
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
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      lazyioc.service("SomeEntity", Entity);
      expect(lazyioc.container.SomeEntityProvider).notEquals(undefined);
      expect(lazyioc.container.SomeEntity).notEquals(undefined);
    });
    it("injects dependencies by passing them as string keys", function() {
      const lazyioc = new LazyIoc();
      const Entity = function(foo, bar) {
        this.foo = foo;
        this.bar = bar;
      };
      lazyioc.service("Entity", Entity, "foo", "bar");
      lazyioc.service("foo", function() {
        this.name = "foo";
      });
      lazyioc.value("bar", "bippity");

      expect(lazyioc.container.Entity).notEquals(undefined);
      expect(lazyioc.container.Entity.foo).notEquals(undefined);
      expect(lazyioc.container.Entity.foo.name).equals("foo");
      expect(lazyioc.container.Entity.bar).equals("bippity");
    });

    it("should nest lazyioc containers if the service name uses dot notation", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      lazyioc.service("Generic.Entity", Entity);
      expect(lazyioc.container.Generic).notEquals(undefined);
      expect(lazyioc.container.Generic.EntityProvider).notEquals(undefined);
      expect(lazyioc.container.Generic.Entity).notEquals(undefined);
    });

    it("can resolve dot-notation dependencies", function() {
      const lazyioc = new LazyIoc();
      const Entity = function(sub) {
        this.sub = sub;
      };
      const SubEntity = function() {};
      lazyioc.service("Entity", Entity, "Nest.SubEntity");
      lazyioc.service("Nest.SubEntity", SubEntity);
      expect(lazyioc.container.Entity.sub).notEquals(undefined);
      expect(lazyioc.container.Entity.sub instanceof SubEntity).equals(true);
    });

    describe("strict service resolution", function() {
      clone.beforeEach(function() {
        LazyIoc.config.strict = false;
        const lazyioc = LazyIoc.getModule();
      });
      clone.afterEach(function() {
        LazyIoc.config.strict = false;
      });
      it("should not care if a service is undefined when strict mode is off", function() {
        const Entity = function(phantom) {
          this.phantom = phantom;
        };

        LazyIoc.config.strict = false;
        lazyioc.service("Entity", Entity, "PhantomService");
        expect(lazyioc.container.Entity).notEquals(undefined);
        expect(lazyioc.container.Entity.phantom).equals(undefined);
      });
      it("should throw an exception if a service is undefined in strict mode", function() {
        const Entity = function(phantom) {
          this.phantom = phantom;
        };

        LazyIoc.config.strict = true;
        lazyioc.service("AnotherEntity", Entity, "PhantomService");

        const test = function() {
          return lazyioc.container.AnotherEntity;
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
