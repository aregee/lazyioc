const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();
  let describe = clone.spec;
  let it = clone;
  let expect = clone;
  let spyOn = clone.spy;

  /**
   * AppShell Instance Factory test suite
   */
  describe("AppShell#instanceFactory", function() {
    describe("when the same key is used twice", function() {
    
      const lazyioc = new AppShell();
      clone.beforeEach(function() {
        console.error = spyOn(console.error);
        lazyioc.instanceFactory("same.name", function() {
          return {};
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          lazyioc.instanceFactory("same.name", function() {});
          expect(console.error.callCount).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          lazyioc.container.same.name.instance();
        });
        it("logs an error", function() {
          let before = console.error.callCount;
          lazyioc.instanceFactory("same.name", function() {});
          expect(console.error.callCount).notEquals(before);
        });
      });
    });
    it("creates a provider instance on the container", function() {
      const lazyioc = new AppShell();
      const ThingFactory = function() {};
      lazyioc.instanceFactory("Thing", ThingFactory);
      expect(lazyioc.container.ThingProvider).notEquals(undefined);
    });
    it("creates an instance factory that gets passesed a container when it is requested", function() {
      const lazyioc = new AppShell();
      const spy = spyOn(function() {
        return true;
      });
      lazyioc.instanceFactory("Thing", spy);
      expect(lazyioc.container.Thing).notEquals(undefined);
      expect(spy.callCount).equals(0);
      lazyioc.container.Thing.instance();
      expect(spy.args[0]).equals(lazyioc.container);
    });

    it("will create new instances when instance is called", function() {
      const lazyioc = new AppShell();
      let i = 0;
      const Thing = function() {
        i++;
      };
      const ThingFactory = function() {
        return new Thing();
      };
      lazyioc.instanceFactory("Thing", ThingFactory);
      expect(lazyioc.container.Thing.instance()).notEquals(undefined);
      expect(lazyioc.container.Thing.instance()).notEquals(
        lazyioc.container.Thing.instance()
      );
      expect(i).equals(3);
    });
  });

  clone.run();
}(o);
