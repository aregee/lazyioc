const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  /**
   * lazyioc Decorator test suite
   */
  describe("AppShell#decorator", function() {
    it("will add a decorator for every provider if no key is passed", function() {
      let appShell = new AppShell("decorator");
      appShell.service("Thing", function() {
        this.name = "Thing";
      });
      appShell.service("Prop", function() {
        this.name = "Prop";
      });
      appShell.decorator(function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(appShell.container.Thing.name).equals("FooBar");
      expect(appShell.container.Prop.name).equals("FooBar");
    });

    it("will add a decorator for a single type if a name is passed", function() {
      let appShell = new AppShell("decorator");
      appShell.service("Thing", function() {
        this.name = "Thing";
      });
      appShell.service("Prop", function() {
        this.name = "Prop";
      });
      appShell.decorator("Thing", function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(appShell.container.Thing.name).equals("FooBar");
      expect(appShell.container.Prop.name).equals("Prop");
    });

    it("can handle dot notation keys", function() {
      let appShell = new AppShell("decorator");
      appShell.service("Util.Thing", function() {
        this.name = "Util Thing";
      });
      appShell.decorator("Util.Thing", function(Service) {
        Service.name = "Util FooBar";
        return Service;
      });
      expect(appShell.container.Util.Thing.name).equals("Util FooBar");
    });

    it("will decorate deeply nested services", function() {
      let appShell = new AppShell("decorator");
      appShell.service("Util.A.B.C.Thing", function() {
        this.name = "Util";
      });
      appShell.decorator("Util.A.B.C.Thing", function(Service) {
        Service.name = "Util Deep FooBar";
        return Service;
      });
      expect(appShell.container.Util.A.B.C.Thing.name).equals(
        "Util Deep FooBar"
      );
    });

    it("will allow decorators to be defined before services", function() {
      let appShell = new AppShell("decorator");
      appShell.decorator("Util.A.B.C.Thing", function(Service) {
        Service.name = "Util Deep FooBar";
        return Service;
      });
      appShell.service("Util.A.B.C.Thing", function() {
        this.name = "Util";
      });
      expect(appShell.container.Util.A.B.C.Thing.name).equals(
        "Util Deep FooBar"
      );
    });
  });
  describe("container#$decorator", function() {
    it("will add a decorator for every provider if no key is passed", function() {
      let appShell = new AppShell("decorator");
      appShell.service("ns.Thing", function() {
        this.name = "Thing";
      });
      appShell.service("ns.Prop", function() {
        this.name = "Prop";
      });
      appShell.container.ns.$decorator(function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(appShell.container.ns.Thing.name).equals("FooBar");
      expect(appShell.container.ns.Prop.name).equals("FooBar");
    });

    it("will add a decorator for a single type if a name is passed", function() {
      let appShell = new AppShell("decorator");
      appShell.service("ns.Thing", function() {
        this.name = "Thing";
      });
      appShell.service("ns.Prop", function() {
        this.name = "Prop";
      });
      appShell.container.ns.$decorator("Thing", function(Service) {
        Service.name = "FooBar";
        return Service;
      });
      expect(appShell.container.ns.Thing.name).equals("FooBar");
      expect(appShell.container.ns.Prop.name).equals("Prop");
    });

    it("can handle dot notation keys", function() {
      let appShell = new AppShell("decorator");
      appShell.service("ns.Util.Thing", function() {
        this.name = "Util Thing";
      });
      appShell.container.ns.$decorator("Util.Thing", function(Service) {
        Service.name = "Util FooBar";
        return Service;
      });
      expect(appShell.container.ns.Util.Thing.name).equals("Util FooBar");
    });

    it("will decorate deeply nested services", function() {
      let appShell = new AppShell("decorator");
      appShell.service("ns.Util.A.B.C.Thing", function() {
        this.name = "Util";
      });
      appShell.container.ns.$decorator("Util.A.B.C.Thing", function(Service) {
        Service.name = "Util Deep FooBar";
        return Service;
      });
      expect(appShell.container.ns.Util.A.B.C.Thing.name).equals(
        "Util Deep FooBar"
      );
    });
  });

  clone.run();
}(o);
