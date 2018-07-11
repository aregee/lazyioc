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
  describe("LazyIoc#serviceFactory", function() {
    it("injects dependencies to a service factory", function() {
      const lazyIoc = new LazyIoc();
      const createEntity = function(foo, bar) {
        return { foo: foo, bar: bar };
      };
      lazyIoc.serviceFactory("Entity", createEntity, "foo", "bar");
      lazyIoc.service("foo", function() {
        this.name = "foo";
      });
      lazyIoc.value("bar", "bippity");

      expect(lazyIoc.container.Entity).notEquals(undefined);
      expect(lazyIoc.container.Entity.foo).notEquals(undefined);
      expect(lazyIoc.container.Entity.foo.name).equals("foo");
      expect(lazyIoc.container.Entity.bar).equals("bippity");
    });
  });

  clone.run();
}(o);
