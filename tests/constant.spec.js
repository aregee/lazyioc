const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  /**
   * lazyioc Constant test suite
   */
  describe("lazyioc#constant", function() {
    it("creates an immutable property on the container", function() {
      let lazyIoc = new LazyIoc("constant");
      let container = lazyIoc.container;

      expect(typeof container.permanent).equals("undefined");

      lazyIoc.constant("permanent", "abc");
      expect(container.permanent).equals("abc");

      try {
        container.permanent = "xyz";
      } catch (e) {
        // TypeError: Attempted to assign to readonly property.
      }
      expect(container.permanent).equals("abc");

      try {
        delete container.permanent;
      } catch (e) {
        // TypeError: Unable to delete property.
      }
      expect(container.permanent).equals("abc");
    });

    it("should nest lazyIoc containers if the name uses dot notation", function() {
      let lazyioc = new LazyIoc("foo");
      lazyioc.constant("nested", {});
      lazyioc.constant("nested.entity", "123");
      expect(lazyioc.container.nested.entity).equals("123");

      try {
        lazyioc.container.nested.entity = "xyz";
      } catch (e) {
        // TypeError: Attempted to assign to readonly property.
      }
      expect(lazyioc.container.nested.entity).equals("123");

      try {
        delete lazyioc.container.nested.entity;
      } catch (e) {
        // TypeError: Unable to delete property.
      }
      expect(lazyioc.container.nested.entity).equals("123");
    });
  });
  clone.run();
}(o);
