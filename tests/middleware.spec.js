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
      lazyIoc.service("Thing", function() {
        this.name = "Thing";
      });
      lazyIoc.middleware("Thing", function(service, next) {
        count++;
        next();
      });
      expect(count).equals(0);
      expect(lazyIoc.container.Thing).notEquals(undefined);
      expect(count).equals(1);
      expect(lazyIoc.container.Thing).notEquals(undefined);
      expect(count).equals(2);
    });
    it("middleware get the service as the first param", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Thing", function() {
        this.name = "Thing";
      });
      lazyIoc.middleware("Thing", function(service, next) {
        service.name = "Something New";
        next();
      });
      expect(lazyIoc.container.Thing.name).equals("Something New");
    });

    it("generic middleware run for all services", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Thing1", function() {
        this.name = "Thing1";
      });
      lazyIoc.service("Thing2", function() {
        this.name = "Thing2";
      });
      lazyIoc.middleware(function(service, next) {
        service.name = "Changed";
        next();
      });
      expect(lazyIoc.container.Thing1.name).equals("Changed");
      expect(lazyIoc.container.Thing2.name).equals("Changed");
    });

    it("can handle dot notation keys", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Util.Thing", function() {
        this.name = "Util Thing";
      });
      lazyIoc.middleware("Util.Thing", function(service, next) {
        service.name = "Middleware Thing";
        next();
      });
      expect(lazyIoc.container.Util.Thing.name).equals("Middleware Thing");
    });

    it("can handle deeply nested dot notation keys", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Util.A.B.C.Thing", function() {
        this.name = "Util Thing";
      });
      lazyIoc.middleware("Util.A.B.C.Thing", function(service, next) {
        service.name = "Middleware Thing";
        next();
      });
      expect(lazyIoc.container.Util.A.B.C.Thing.name).equals("Middleware Thing");
    });

    it("can register middleware before the service", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.middleware("Util.A.B.C.Thing", function(service, next) {
        service.name = "Middleware Thing";
        next();
      });
      lazyIoc.service("Util.A.B.C.Thing", function() {
        this.name = "Util Thing";
      });
      expect(lazyIoc.container.Util.A.B.C.Thing.name).equals("Middleware Thing");
    });

    it("throw error when next(err)", function() {
      const lazyIoc = new LazyIoc();
      lazyIoc.service("Thing", function() {
        this.name = "Thing";
      });
      this.e = new Error("Thing error");
      let context = this;
      lazyIoc.middleware("Thing", function(service, next) {
        next(context.e);
      });
      try {
        lazyIoc.container.Thing.name;
      } catch (error) {
        expect(error).equals(context.e);  
      }
    });
  });
  clone.run();
}(o);
