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
      clone.beforeEach(function() {
        this.appShell = new AppShell();
        let logger = {};
        logger.count = 0;
        logger.error = err => {
          console.count++;
        };
        Object.assign(console, logger);
        this.spy = spyOn(console.error);
        this.appShell.instanceFactory("same.name", function() {
          return {};
        });
      });
      describe("when the service has not yet been instantiated", function() {
        it("doesn't log an error", function() {
          this.appShell.instanceFactory("same.name", function() {});
          expect(console.count).equals(0);
        });
      });
      describe("when the service has already been instantiated", function() {
        clone.beforeEach(function() {
          this.appShell.container.same.name.instance();
        });
        it("logs an error", function() {
          this.appShell.instanceFactory("same.name", function() {});
          expect(console.count).equals(2);
        });
      });
    });
    it("creates a provider instance on the container", function() {
      const appShell = new AppShell();
      const ThingFactory = function() {};
      appShell.instanceFactory("Thing", ThingFactory);
      expect(appShell.container.ThingProvider).notEquals(undefined);
    });
    it("creates an instance factory that gets passesed a container when it is requested", function() {
      const appShell = new AppShell();
      const spy = spyOn(function() {
        return true;
      });
      appShell.instanceFactory("Thing", spy);
      expect(appShell.container.Thing).notEquals(undefined);
      expect(spy.callCount).equals(0);
      appShell.container.Thing.instance();
      expect(spy.args[0]).equals(appShell.container);
    });

    it("will create new instances when instance is called", function() {
      const appShell = new AppShell();
      let i = 0;
      const Thing = function() {
        i++;
      };
      const ThingFactory = function() {
        return new Thing();
      };
      appShell.instanceFactory("Thing", ThingFactory);
      expect(appShell.container.Thing.instance()).notEquals(undefined);
      expect(appShell.container.Thing.instance()).notEquals(
        appShell.container.Thing.instance()
      );
      expect(i).equals(3);
    });
  });

  clone.run();
}(o);
