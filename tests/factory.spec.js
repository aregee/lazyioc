const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * lazyIoc Factory test suite
   */
  describe("LazyIoc#factory", function() {
    describe("when the same key is used twice", function() {
      clone.beforeEach(function() {

        this.lazyioc = new LazyIoc();
        console.error = spyOn(console.error);
        this.lazyioc.factory("same.name", function() {
          return function() {};
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          this.lazyioc.factory("same.name", function() {});
          expect(console.error.callCount).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          this.lazyioc.container.same.name();
        });
        it("logs an error", function() {
          this.lazyioc.factory("same.name", function() {});
          expect(console.error.callCount).equals(1); // two error warnings raised for `same` and `name` providers already registered
        });
      });
    });
    it("creates a provider instance on the container", function() {
      let inst = new LazyIoc();
      const EntityFactory = function() {};
      inst.factory("Entity", EntityFactory);
      expect(inst.container.EntityProvider).notEquals(undefined);
    });
    it("creates services, and gets passesed a container", function() {
      let inst = new LazyIoc();
      let invoked = 0;
      let spy = clone.spy(() => {
        invoked++;
        return { active: true };
      });
      inst.factory("Entity", spy);
      expect(inst.container.Entity.active).equals(true);
      expect(invoked).equals(1);
    });

    it("should nest LazyIoc containers if the service name uses dot notation", function() {
      let lazyIoc = new LazyIoc();
      let Entity = function() {};
      let EntityFactory = function() {
        return new Entity();
      };
      lazyIoc.factory("Generic.Entity", EntityFactory);
      expect(lazyIoc.container.Generic).notEquals(undefined);
      expect(lazyIoc.container.Generic.EntityProvider).notEquals(undefined);
      expect(lazyIoc.container.Generic.Entity).notEquals(undefined);
    });
  });

  clone.run();
}(o);
