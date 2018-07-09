const o = require("ospec");
const { AppShell } = require("../bundle");

new function(o) {
  let clone = o.new();

  clone.spec("lazyioc config", function() {
    clone("expect AppShell to be a Function", function() {
      clone(typeof AppShell).equals(
        "function"
      )("Appshell should be is a Function");
    });

    clone("expect container to be instance of AppShell", function() {
      let appShellInstance = new AppShell();
      clone(appShellInstance instanceof AppShell).equals(
        true
      )("Should be true");
    });

    clone(
      "expect to create new instance even if called  with same name",
      function() {
        /* jshint newcap: false */
        let d1 = new AppShell("fooBar");
        d1.provider("foo", function() {
          this.$get = function() {};
          return this;
        });
        d1.service("foo.bar", function() {
          return this;
        });
        let d2 = new AppShell("fooBar");
        clone(d1).notEquals(d2)("should be a new instance");
        /* jshint newcap: true */
      }
    );

    clone.spec("Provide a singleton intance forEach case", () => {
      let instance;
      clone.beforeEach(() => {
        instance = new AppShell("parent");
      });

      clone(
        "expect to return new module if appShellInstance.module is invoked ",
        () => {
          let one = instance.module("one");
          let two = instance.module("two");
          clone(one).notEquals(two)("should be a new instance");
          /* jshint newcap: true */
        }
      );

      clone(
        "expect to return same module if appShellInstance.module is invoked with already exsting module name",
        () => {
          clone(instance.module("one")).equals(instance.module("one"))(
            "should not be a new instance"
          );
          /* jshint newcap: true */
        }
      );
      clone(
        "will not return the same instance with the same name after #clear",
        function() {
          let child = instance.module("child");
          clone(instance.module("child")).equals(child);
          instance.clear();
          clone(instance.module("child")).notEquals(child);
        }
      );

      clone(
        "will return the same instance when another named instance is cleared",
        function() {
          let foo = instance.module("Foo");
          instance.module("Bar");
          clone(instance.module("Foo")).equals(foo);
          instance.clear("Bar");
          clone(instance.module("Foo")).equals(foo);
        }
      );

      clone("will not have name if not passed a name parameter", function() {
        let childInst = instance.module();
        clone(childInst.container.CONTAINER_NAME).equals(undefined);
      });
      clone(
        "will make the instance name available when a name is passed",
        function() {
          let childInst = instance.module("Baz");
          clone(childInst.container.CONTAINER_NAME).equals("Baz");
        }
      );
      clone(
        "will return the same instance when a name is passed, even if the string == false",
        function() {
          clone(instance.module("")).equals(instance.module(""));
          clone(instance.module("0")).equals(instance.module("0"));
        }
      );
    });
  });
  clone.run();
}(o);
