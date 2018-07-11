const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * LazyIoc Instance Factory test suite
   */
  describe("LazyIoc#instanceFactory", function() {
    describe("when the same key is used twice", function() {
    
      const lazyioc = new LazyIoc();
      clone.beforeEach(function() {
        console.error = spyOn(console.error);
        lazyioc.instanceFactory("same.name", function() {
          return {};
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          lazyioc.instanceFactory("same.name", function() {});
          expect(console.error.callCount).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          lazyioc.container.same.name.instance();
        });
        it("logs an error", function() {
          let before = console.error.callCount;
          lazyioc.instanceFactory("same.name", function() {});
          expect(console.error.callCount).notEquals(before);
        });
      });
    });
    it("creates a provider instance on the container", function() {
      const lazyioc = new LazyIoc();
      const EntityFactory = function() {};
      lazyioc.instanceFactory("Entity", EntityFactory);
      expect(lazyioc.container.EntityProvider).notEquals(undefined);
    });
    it("creates an instance factory that gets passesed a container when it is requested", function() {
      const lazyioc = new LazyIoc();
      const spy = spyOn(function() {
        return true;
      });
      lazyioc.instanceFactory("Entity", spy);
      expect(lazyioc.container.Entity).notEquals(undefined);
      expect(spy.callCount).equals(0);
      lazyioc.container.Entity.instance();
      expect(spy.args[0]).equals(lazyioc.container);
    });

    it("should create new instances when instance is called", function() {
      const lazyioc = new LazyIoc();
      let i = 0;
      const Entity = function() {
        i++;
      };
      const EntityFactory = function() {
        return new Entity();
      };
      lazyioc.instanceFactory("Entity", EntityFactory);
      expect(lazyioc.container.Entity.instance()).notEquals(undefined);
      expect(lazyioc.container.Entity.instance()).notEquals(
        lazyioc.container.Entity.instance()
      );
      expect(i).equals(3);
    });
  });

  clone.run();
}(o);
