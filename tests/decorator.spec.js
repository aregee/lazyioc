const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  /**
   * lazyioc Decorator test suite
   */
  describe("LazyIoc#decorator", function() {
    it("should add a decorator for every provider if no key is passed", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.service("Prop", function() {
        this.name = "Prop";
      });
      lazyIoc.decorator(function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(lazyIoc.container.Entity.name).equals("FooBar");
      expect(lazyIoc.container.Prop.name).equals("FooBar");
    });

    it("should add a decorator for a single type if a name is passed", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.service("Prop", function() {
        this.name = "Prop";
      });
      lazyIoc.decorator("Entity", function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(lazyIoc.container.Entity.name).equals("FooBar");
      expect(lazyIoc.container.Prop.name).equals("Prop");
    });

    it("can handle dot notation keys", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("Generic.Entity", function() {
        this.name = "Generic Entity";
      });
      lazyIoc.decorator("Generic.Entity", function(Service) {
        Service.name = "Generic FooBar";
        return Service;
      });
      expect(lazyIoc.container.Generic.Entity.name).equals("Generic FooBar");
    });

    it("should decorate deeply nested services", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("Generic.A.B.C.Entity", function() {
        this.name = "Generic";
      });
      lazyIoc.decorator("Generic.A.B.C.Entity", function(Service) {
        Service.name = "Generic Deep FooBar";
        return Service;
      });
      expect(lazyIoc.container.Generic.A.B.C.Entity.name).equals(
        "Generic Deep FooBar"
      );
    });

    it("should allow decorators to be defined before services", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.decorator("Generic.A.B.C.Entity", function(Service) {
        Service.name = "Generic Deep FooBar";
        return Service;
      });
      lazyIoc.service("Generic.A.B.C.Entity", function() {
        this.name = "Generic";
      });
      expect(lazyIoc.container.Generic.A.B.C.Entity.name).equals(
        "Generic Deep FooBar"
      );
    });
  });
  describe("container#$decorator", function() {
    it("should add a decorator for every provider if no key is passed", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("ns.Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.service("ns.Prop", function() {
        this.name = "Prop";
      });
      lazyIoc.container.ns.$decorator(function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(lazyIoc.container.ns.Entity.name).equals("FooBar");
      expect(lazyIoc.container.ns.Prop.name).equals("FooBar");
    });

    it("should add a decorator for a single type if a name is passed", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("ns.Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.service("ns.Prop", function() {
        this.name = "Prop";
      });
      lazyIoc.container.ns.$decorator("Entity", function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(lazyIoc.container.ns.Entity.name).equals("FooBar");
      expect(lazyIoc.container.ns.Prop.name).equals("Prop");
    });

    it("can handle dot notation keys", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("ns.Generic.Entity", function() {
        this.name = "Generic Entity";
      });
      lazyIoc.container.ns.$decorator("Generic.Entity", function(Service) {
        Service.name = "Generic FooBar";
        return Service;
      });
      expect(lazyIoc.container.ns.Generic.Entity.name).equals("Generic FooBar");
    });

    it("should decorate deeply nested services", function() {
      let lazyIoc = new LazyIoc("decorator");
      lazyIoc.service("ns.Generic.A.B.C.Entity", function() {
        this.name = "Generic";
      });
      lazyIoc.container.ns.$decorator("Generic.A.B.C.Entity", function(Service) {
        Service.name = "Generic Deep FooBar";
        return Service;
      });
      expect(lazyIoc.container.ns.Generic.A.B.C.Entity.name).equals(
        "Generic Deep FooBar"
      );
    });
  });

  clone.run();
}(o);
