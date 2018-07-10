const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;
  /**
   * Bottle Register test suite
   */
  describe("Bottle#register", function() {
    it("will register a service under the $name property", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      Thing.$name = "Thing";
      lazyioc.register(Thing);
      expect(lazyioc.container.Thing instanceof Thing).equals(true);
    });
    it("will inject a dependency provided by the $inject property", function() {
      const lazyioc = new AppShell();
      const Dep1 = function() {};
      const Thing = function(d1) {
        expect(d1 instanceof Dep1).equals(true);
      };
      Thing.$name = "Thing";
      Thing.$inject = "Dep1";

      lazyioc.service("Dep1", Dep1);
      lazyioc.register(Thing);
      expect(lazyioc.container.Thing).notEquals(undefined);
    });
    it("will inject multiple dependencies if $inject is an array", function() {
      const lazyioc = new AppShell();
      const Dep1 = function() {};
      const Dep2 = function() {};
      const Thing = function() {
        expect(arguments.length).equals(2);
      };
      Thing.$name = "Thing";
      Thing.$inject = ["Dep1", "Dep2"];

      lazyioc.service("Dep1", Dep1);
      lazyioc.service("Dep2", Dep2);
      lazyioc.register(Thing);
      expect(lazyioc.container.Thing).notEquals(undefined);
    });
    it("defaults to Bottle#service if no $type is provided", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      Thing.$name = "Thing";
      Thing.$inject = ["A", "B"];
      lazyioc.service = spyOn(lazyioc.service);
      lazyioc.register(Thing);
      expect(
        lazyioc.service.args.length === ["Thing", Thing, "A", "B"].length
      ).equals(true);
    });
    it("can register a factory", function() {
      const lazyioc = new AppShell();
      const ThingFactory = function() {};
      ThingFactory.$name = "Thing";
      ThingFactory.$type = "factory";

      lazyioc.factory = spyOn(lazyioc.factory);

      lazyioc.register(ThingFactory);
      expect(lazyioc.factory.args[0]).equals("Thing");
      expect(lazyioc.factory.args[1]).equals(ThingFactory);
    });

    it("can register a provider", function() {
      const lazyioc = new AppShell();
      const ThingProvider = function() {};
      ThingProvider.$name = "Thing";
      ThingProvider.$type = "provider";

      lazyioc.provider = spyOn(lazyioc.provider);

      lazyioc.register(ThingProvider);
      expect(lazyioc.provider.args[0]).equals("Thing");
      expect(lazyioc.provider.args[1]).equals(ThingProvider);
    });
    it("can register a value", function() {
      const lazyioc = new AppShell();
      const value = {
        $name: "someValue",
        $type: "value"
      };
      lazyioc.value = spyOn(lazyioc.value);
      lazyioc.register(value);
      expect(lazyioc.value.args[0]).equals("someValue");
      expect(lazyioc.value.args[1]).equals(value);
    });
    it("can nest definitions if dot notation is used", function() {
      const lazyioc = new AppShell();
      const ThingA = function() {};
      const ThingB = function() {};
      ThingA.$name = "Util.ThingA";
      ThingB.$name = "Util.ThingB";

      lazyioc.register(ThingA);
      lazyioc.register(ThingB);

      expect(lazyioc.container.Util).notEquals(undefined);
      expect(lazyioc.container.Util.ThingA instanceof ThingA).equals(true);
      expect(lazyioc.container.Util.ThingB instanceof ThingB).equals(true);
    });
    it("supports the $value property", function() {
      const lazyioc = new AppShell();
      const value = {};
      const config = {
        $name: "someValue",
        $type: "value",
        $value: value
      };
      lazyioc.value = spyOn(lazyioc.value);
      lazyioc.register(config);
      expect(lazyioc.value.args[0]).equals("someValue");
      expect(lazyioc.value.args[1]).equals(value);
      expect(lazyioc.container.someValue === value).equals(true);
    });
  });
  describe("container#$register", function() {
    it("will register a service under the $name property", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      Thing.$name = "Thing";
      lazyioc.container.$register(Thing);
      expect(lazyioc.container.Thing instanceof Thing).equals(true);
    });
    it("will inject a dependency provided by the $inject property", function() {
      const lazyioc = new AppShell();
      const Dep1 = function() {};
      const Thing = function(d1) {
        expect(d1 instanceof Dep1).equals(true);
      };
      Thing.$name = "Thing";
      Thing.$inject = "Dep1";

      lazyioc.service("Dep1", Dep1);
      lazyioc.container.$register(Thing);
      expect(lazyioc.container.Thing).notEquals(undefined);
    });
    it("will inject multiple dependencies if $inject is an array", function() {
      const lazyioc = new AppShell();
      const Dep1 = function() {};
      const Dep2 = function() {};
      const Thing = function() {
        expect(arguments.length).equals(2);
      };
      Thing.$name = "Thing";
      Thing.$inject = ["Dep1", "Dep2"];

      lazyioc.service("Dep1", Dep1);
      lazyioc.service("Dep2", Dep2);
      lazyioc.container.$register(Thing);
      expect(lazyioc.container.Thing).notEquals(undefined);
    });
    it("defaults to Bottle#service if no $type is provided", function() {
      const lazyioc = new AppShell();
      const Thing = function() {};
      Thing.$name = "Thing";
      Thing.$inject = ["A", "B"];

      lazyioc.service = spyOn(lazyioc.service);

      lazyioc.container.$register(Thing);
      expect(lazyioc.service.args[0]).equals("Thing");
      expect(lazyioc.service.args[1]).equals(Thing);
      expect(lazyioc.service.args[2]).equals("A");
      expect(lazyioc.service.args[3]).equals("B");
    });
    it("can register a factory", function() {
      const lazyioc = new AppShell();
      const ThingFactory = function() {};
      ThingFactory.$name = "Thing";
      ThingFactory.$type = "factory";

      lazyioc.factory = spyOn(lazyioc.factory);

      lazyioc.container.$register(ThingFactory);
      expect(lazyioc.factory.args[0]).equals("Thing");
      expect(lazyioc.factory.args[1]).equals(ThingFactory);
    });
    it("can register a provider", function() {
      const lazyioc = new AppShell();
      const ThingProvider = function() {};
      ThingProvider.$name = "Thing";
      ThingProvider.$type = "provider";

      lazyioc.provider = spyOn(lazyioc.provider);

      lazyioc.container.$register(ThingProvider);
      expect(lazyioc.provider.args[0]).equals("Thing");
      expect(lazyioc.provider.args[1]).equals(ThingProvider);
    });
    it("can register a value", function() {
      const lazyioc = new AppShell();
      const value = {
        $name: "someValue",
        $type: "value"
      };
      lazyioc.value = spyOn(lazyioc.value);
      lazyioc.container.$register(value);
      expect(lazyioc.value.args[0]).equals("someValue");
      expect(lazyioc.value.args[1]).equals(value);
    });
  });
  clone.run();
}(o);
