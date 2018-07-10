const o = require("ospec");
const { AppShell } = require("../bundle");

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
      let appShell = new AppShell("constant");
      let container = appShell.container;

      expect(typeof container.permanent).equals("undefined");

      appShell.constant("permanent", "abc");
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

    it("will nest appShell containers if the name uses dot notation", function() {
      let lazyioc = new AppShell("foo");
      lazyioc.constant("nested", {});
      lazyioc.constant("nested.thing", "123");
      expect(lazyioc.container.nested.thing).equals("123");

      try {
        lazyioc.container.nested.thing = "xyz";
      } catch (e) {
        // TypeError: Attempted to assign to readonly property.
      }
      expect(lazyioc.container.nested.thing).equals("123");

      try {
        delete lazyioc.container.nested.thing;
      } catch (e) {
        // TypeError: Unable to delete property.
      }
      expect(lazyioc.container.nested.thing).equals("123");
    });
  });
  clone.run();
}(o);
