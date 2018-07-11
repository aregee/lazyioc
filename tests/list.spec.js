const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * lazyioc List test suite
   */
  describe("lazyioc#list", function() {
    it("should return an empty array if no container is provided", function() {
      const lazyioc = new LazyIoc();
      expect(lazyioc.list() instanceof Array).equals(true);
      expect(lazyioc.list().length).equals(0);
    });
    it("should return a list of registered services from a passed container", function() {
      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.list(lazyioc.container);
      expect(list.indexOf("A")).notEquals(-1);
      expect(list.indexOf("B")).notEquals(-1);
    });

    it("should exclude shell methods from the returned list", function() {
      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.list(lazyioc.container);
      expect(list.indexOf("$register")).equals(-1);
      expect(list.indexOf("$list")).equals(-1);
      expect(list.length).equals(2);
    });
  });

  describe("prototype#list", function() {
    it("should return an empty array if no services have been registered", function() {
      const lazyioc = new LazyIoc();
      expect(lazyioc.list() instanceof Array).equals(true);
      expect(lazyioc.list().length).equals(0);
    });
    it("should return a list of registered services", function() {
      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.list();
      expect(list.indexOf("A")).notEquals(-1);
      expect(list.indexOf("B")).notEquals(-1);
    });
    it("should exclude container methods from the returned list", function() {
      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.list();
      expect(list.indexOf("$register")).equals(-1);
      expect(list.indexOf("$list")).equals(-1);
      expect(list.length).equals(2);
    });
  });
  describe("container#$list", function() {
    it("should return an empty array if no services have been registered", function() {
      const lazyioc = new LazyIoc();
      expect(lazyioc.container.$list() instanceof Array).equals(true);
      expect(lazyioc.container.$list().length).equals(0);
    });
    it("should return a list of registered services", function() {
      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.container.$list();
      expect(list.indexOf("A")).notEquals(-1);
      expect(list.indexOf("B")).notEquals(-1);
    });
    it("should exclude container methods from the returned list", function() {

      const lazyioc = new LazyIoc();
      lazyioc.service("A", function() {});
      lazyioc.service("B", function() {});

      const list = lazyioc.container.$list();
      expect(list.indexOf("$register")).equals(-1);
      expect(list.indexOf("$list")).equals(-1);
      expect(list.length).equals(2);
    });
    it("should work with nested containers", function() {
      
      const lazyioc = new LazyIoc();
      lazyioc.service("test.A", function() {});
      lazyioc.service("test.B", function() {});

      const list = lazyioc.container.test.$list();
      expect(list.indexOf("A")).notEquals(-1);
      expect(list.indexOf("B")).notEquals(-1);
    });
  });

  clone.run();
}(o);
