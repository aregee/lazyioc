const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;

  /**
   * lazyioc Defer Resolve test suite
   */
  describe("LazyIoc#defer", function() {
    it("will register functions to be executed later", function() {
      const appShell = new AppShell();
      let executed = false;

      appShell.defer(function() {
        executed = true;
      });

      expect(executed).equals(false);
      appShell.resolve();
      expect(executed).equals(true);
    });
  });
  describe("LazyIoc#resolve", function() {
    it("will pass data to deferred functions", function() {
      const appShell = new AppShell();
      let test;

      appShell.defer(function(value) {
        test = value;
      });

      expect(test).notEquals("Cookie");
      appShell.resolve("Cookie");
      expect(test).equals("Cookie");
    });
  });
  clone.run();
}(o);
