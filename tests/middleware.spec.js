const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * lazyIoc Middleware test suite
   */
  describe("lazyIoc#middleware", function() {
    it("middleware get executed every time a service is accessed", function() {
      const lazyIoc = new LazyIoc();
      let count = 0;
      lazyIoc.service("Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.middleware("Entity", function(service, next) {
        count++;
        next();
      });
      expect(count).equals(0);
      expect(lazyIoc.container.Entity).notEquals(undefined);
      expect(count).equals(1);
      expect(lazyIoc.container.Entity).notEquals(undefined);
      expect(count).equals(2);
    });
    it("middleware get the service as the first param", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Entity", function() {
        this.name = "Entity";
      });
      lazyIoc.middleware("Entity", function(service, next) {
        service.name = "Someentity New";
        next();
      });
      expect(lazyIoc.container.Entity.name).equals("Someentity New");
    });

    it("generic middleware run for all services", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Entity1", function() {
        this.name = "Entity1";
      });
      lazyIoc.service("Entity2", function() {
        this.name = "Entity2";
      });
      lazyIoc.middleware(function(service, next) {
        service.name = "Changed";
        next();
      });
      expect(lazyIoc.container.Entity1.name).equals("Changed");
      expect(lazyIoc.container.Entity2.name).equals("Changed");
    });

    it("can handle dot notation keys", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Generic.Entity", function() {
        this.name = "Generic Entity";
      });
      lazyIoc.middleware("Generic.Entity", function(service, next) {
        service.name = "Middleware Entity";
        next();
      });
      expect(lazyIoc.container.Generic.Entity.name).equals("Middleware Entity");
    });

    it("can handle deeply nested dot notation keys", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Generic.A.B.C.Entity", function() {
        this.name = "Generic Entity";
      });
      lazyIoc.middleware("Generic.A.B.C.Entity", function(service, next) {
        service.name = "Middleware Entity";
        next();
      });
      expect(lazyIoc.container.Generic.A.B.C.Entity.name).equals("Middleware Entity");
    });

    it("can register middleware before the service", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.middleware("Generic.A.B.C.Entity", function(service, next) {
        service.name = "Middleware Entity";
        next();
      });
      lazyIoc.service("Generic.A.B.C.Entity", function() {
        this.name = "Generic Entity";
      });
      expect(lazyIoc.container.Generic.A.B.C.Entity.name).equals("Middleware Entity");
    });

    it("throw error when next(err)", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Entity", function() {
        this.name = "Entity";
      });
      this.e = new Error("Entity error");
      let context = this;
      lazyIoc.middleware("Entity", function(service, next) {
        next(context.e);
      });
      try {
        lazyIoc.container.Entity.name;
      } catch (error) {
        expect(error).equals(context.e);  
      }
    });
  });
  clone.run();
}(o);
