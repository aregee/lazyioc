const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;

  /**
   * lazyioc Digest test suite
   */
  describe("lazyioc#digest", function() {
    it("will get an instance of all services in the container", function() {
      const appShell = new AppShell();
      const thinga = function() {
        this.foo = "a";
      };
      const thingb = function() {
        this.foo = "b";
      };
      let results;
      appShell.service("a", thinga);
      appShell.service("b", thingb);
      results = appShell.digest(["a", "b"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("a");
      expect(results[1].foo).notEquals(undefined);
      expect(results[1].foo).equals("b");
    });
    it("will get an instance of all services in the container in the correct order", function() {
      const appShell = new AppShell();
      const thinga = function() {
        this.foo = "a";
      };
      const thingb = function() {
        this.foo = "b";
      };
      let results;
      appShell.service("a", thinga);
      appShell.service("b", thingb);
      results = appShell.digest(["b", "a"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("b");
      expect(results[1].foo).notEquals(undefined);
      expect(results[1].foo).equals("a");
    });
    it("can digest dot notation strings", function() {
      const appShell = new AppShell();
      const Thing = function() {
        this.foo = "c";
      };
      let results;
      appShell.service("Util.Thing", Thing);
      results = appShell.digest(["Util.Thing"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("c");
    });
  });
  clone.run();
}(o);
