const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;

  /**
   * lazyioc Defer Resolve test suite
   */
  describe("LazyIoc#defer", function() {
    it("should register functions to be executed later", function() {
      const lazyIoc = new LazyIoc();
      let executed = false;

      lazyIoc.defer(function() {
        executed = true;
      });

      expect(executed).equals(false);
      lazyIoc.resolve();
      expect(executed).equals(true);
    });
  });
  describe("LazyIoc#resolve", function() {
    it("should pass data to deferred functions", function() {
      const lazyIoc = new LazyIoc();
      let test;

      lazyIoc.defer(function(value) {
        test = value;
      });

      expect(test).notEquals("Cookie");
      lazyIoc.resolve("Cookie");
      expect(test).equals("Cookie");
    });
  });
  clone.run();
}(o);
