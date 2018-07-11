const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;
  /**
   * LazyIoc Register test suite
   */
  describe("LazyIoc#register", function() {
    it("should register a service under the $name property", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      Entity.$name = "Entity";
      lazyioc.register(Entity);
      expect(lazyioc.container.Entity instanceof Entity).equals(true);
    });
    it("should inject a dependency provided by the $inject property", function() {
      const lazyioc = new LazyIoc();
      const Dep1 = function() {};
      const Entity = function(d1) {
        expect(d1 instanceof Dep1).equals(true);
      };
      Entity.$name = "Entity";
      Entity.$inject = "Dep1";

      lazyioc.service("Dep1", Dep1);
      lazyioc.register(Entity);
      expect(lazyioc.container.Entity).notEquals(undefined);
    });
    it("should inject multiple dependencies if $inject is an array", function() {
      const lazyioc = new LazyIoc();
      const Dep1 = function() {};
      const Dep2 = function() {};
      const Entity = function() {
        expect(arguments.length).equals(2);
      };
      Entity.$name = "Entity";
      Entity.$inject = ["Dep1", "Dep2"];

      lazyioc.service("Dep1", Dep1);
      lazyioc.service("Dep2", Dep2);
      lazyioc.register(Entity);
      expect(lazyioc.container.Entity).notEquals(undefined);
    });
    it("defaults to LazyIoc#service if no $type is provided", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      Entity.$name = "Entity";
      Entity.$inject = ["A", "B"];
      lazyioc.service = spyOn(lazyioc.service);
      lazyioc.register(Entity);
      expect(
        lazyioc.service.args.length === ["Entity", Entity, "A", "B"].length
      ).equals(true);
    });
    it("can register a factory", function() {
      const lazyioc = new LazyIoc();
      const EntityFactory = function() {};
      EntityFactory.$name = "Entity";
      EntityFactory.$type = "factory";

      lazyioc.factory = spyOn(lazyioc.factory);

      lazyioc.register(EntityFactory);
      expect(lazyioc.factory.args[0]).equals("Entity");
      expect(lazyioc.factory.args[1]).equals(EntityFactory);
    });

    it("can register a provider", function() {
      const lazyioc = new LazyIoc();
      const EntityProvider = function() {};
      EntityProvider.$name = "Entity";
      EntityProvider.$type = "provider";

      lazyioc.provider = spyOn(lazyioc.provider);

      lazyioc.register(EntityProvider);
      expect(lazyioc.provider.args[0]).equals("Entity");
      expect(lazyioc.provider.args[1]).equals(EntityProvider);
    });
    it("can register a value", function() {
      const lazyioc = new LazyIoc();
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
      const lazyioc = new LazyIoc();
      const EntityA = function() {};
      const EntityB = function() {};
      EntityA.$name = "Generic.EntityA";
      EntityB.$name = "Generic.EntityB";

      lazyioc.register(EntityA);
      lazyioc.register(EntityB);

      expect(lazyioc.container.Generic).notEquals(undefined);
      expect(lazyioc.container.Generic.EntityA instanceof EntityA).equals(true);
      expect(lazyioc.container.Generic.EntityB instanceof EntityB).equals(true);
    });
    it("supports the $value property", function() {
      const lazyioc = new LazyIoc();
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
    it("should register a service under the $name property", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      Entity.$name = "Entity";
      lazyioc.container.$register(Entity);
      expect(lazyioc.container.Entity instanceof Entity).equals(true);
    });
    it("should inject a dependency provided by the $inject property", function() {
      const lazyioc = new LazyIoc();
      const Dep1 = function() {};
      const Entity = function(d1) {
        expect(d1 instanceof Dep1).equals(true);
      };
      Entity.$name = "Entity";
      Entity.$inject = "Dep1";

      lazyioc.service("Dep1", Dep1);
      lazyioc.container.$register(Entity);
      expect(lazyioc.container.Entity).notEquals(undefined);
    });
    it("should inject multiple dependencies if $inject is an array", function() {
      const lazyioc = new LazyIoc();
      const Dep1 = function() {};
      const Dep2 = function() {};
      const Entity = function() {
        expect(arguments.length).equals(2);
      };
      Entity.$name = "Entity";
      Entity.$inject = ["Dep1", "Dep2"];

      lazyioc.service("Dep1", Dep1);
      lazyioc.service("Dep2", Dep2);
      lazyioc.container.$register(Entity);
      expect(lazyioc.container.Entity).notEquals(undefined);
    });
    it("defaults to LazyIoc#service if no $type is provided", function() {
      const lazyioc = new LazyIoc();
      const Entity = function() {};
      Entity.$name = "Entity";
      Entity.$inject = ["A", "B"];

      lazyioc.service = spyOn(lazyioc.service);

      lazyioc.container.$register(Entity);
      expect(lazyioc.service.args[0]).equals("Entity");
      expect(lazyioc.service.args[1]).equals(Entity);
      expect(lazyioc.service.args[2]).equals("A");
      expect(lazyioc.service.args[3]).equals("B");
    });
    it("can register a factory", function() {
      const lazyioc = new LazyIoc();
      const EntityFactory = function() {};
      EntityFactory.$name = "Entity";
      EntityFactory.$type = "factory";

      lazyioc.factory = spyOn(lazyioc.factory);

      lazyioc.container.$register(EntityFactory);
      expect(lazyioc.factory.args[0]).equals("Entity");
      expect(lazyioc.factory.args[1]).equals(EntityFactory);
    });
    it("can register a provider", function() {
      const lazyioc = new LazyIoc();
      const EntityProvider = function() {};
      EntityProvider.$name = "Entity";
      EntityProvider.$type = "provider";

      lazyioc.provider = spyOn(lazyioc.provider);

      lazyioc.container.$register(EntityProvider);
      expect(lazyioc.provider.args[0]).equals("Entity");
      expect(lazyioc.provider.args[1]).equals(EntityProvider);
    });
    it("can register a value", function() {
      const lazyioc = new LazyIoc();
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
