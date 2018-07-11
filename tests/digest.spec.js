const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;

  /**
   * lazyioc Digest test suite
   */
  describe("lazyioc#digest", function() {
    it("should get an instance of all services in the container", function() {
      const lazyIoc = new LazyIoc();
      const entitya = function() {
        this.foo = "a";
      };
      const entityb = function() {
        this.foo = "b";
      };
      let results;
      lazyIoc.service("a", entitya);
      lazyIoc.service("b", entityb);
      results = lazyIoc.digest(["a", "b"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("a");
      expect(results[1].foo).notEquals(undefined);
      expect(results[1].foo).equals("b");
    });
    it("should get an instance of all services in the container in the correct order", function() {
      const lazyIoc = new LazyIoc();
      const entitya = function() {
        this.foo = "a";
      };
      const entityb = function() {
        this.foo = "b";
      };
      let results;
      lazyIoc.service("a", entitya);
      lazyIoc.service("b", entityb);
      results = lazyIoc.digest(["b", "a"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("b");
      expect(results[1].foo).notEquals(undefined);
      expect(results[1].foo).equals("a");
    });
    it("can digest dot notation strings", function() {
      const lazyIoc = new LazyIoc();
      const Entity = function() {
        this.foo = "c";
      };
      let results;
      lazyIoc.service("Generic.Entity", Entity);
      results = lazyIoc.digest(["Generic.Entity"]);
      expect(results[0].foo).notEquals(undefined);
      expect(results[0].foo).equals("c");
    });
  });
  clone.run();
}(o);
