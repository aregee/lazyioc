const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();

  clone.spec("lazyioc config", function() {
    clone("expect LazyIoc to be a Function", function() {
      clone(typeof LazyIoc).equals(
        "function"
      )("lazyIoc should be is a Function");
    });

    clone("expect container to be instance of LazyIoc", function() {
      let lazyIocInstance = new LazyIoc();
      clone(lazyIocInstance instanceof LazyIoc).equals(
        true
      )("Should be true");
    });

    clone(
      "expect to create new instance even if called  with same name",
      function() {
        /* jshint newcap: false */
        let d1 = new LazyIoc("fooBar");
        d1.provider("foo", function() {
          this.$get = function() {};
          return this;
        });
        d1.service("foo.bar", function() {
          return this;
        });
        let d2 = new LazyIoc("fooBar");
        clone(d1).notEquals(d2)("should be a new instance");
        /* jshint newcap: true */
      }
    );

    clone.spec("Provide a singleton intance forEach case", () => {
      let instance;
      clone.beforeEach(() => {
        instance = new LazyIoc("parent");
      });

      clone(
        "expect to return new module if lazyIocInstance.module is invoked ",
        () => {
          let one = instance.module("one");
          let two = instance.module("two");
          clone(one).notEquals(two)("should be a new instance");
          /* jshint newcap: true */
        }
      );

      clone(
        "expect to return same module if lazyIocInstance.module is invoked with already exsting module name",
        () => {
          clone(instance.module("one")).equals(instance.module("one"))(
            "should not be a new instance"
          );
          /* jshint newcap: true */
        }
      );
      clone(
        "should not return the same instance with the same name after #clear",
        function() {
          let child = instance.module("child");
          clone(instance.module("child")).equals(child);
          instance.clear();
          clone(instance.module("child")).notEquals(child);
        }
      );

      clone(
        "should return the same instance when another named instance is cleared",
        function() {
          let foo = instance.module("Foo");
          instance.module("Bar");
          clone(instance.module("Foo")).equals(foo);
          instance.clear("Bar");
          clone(instance.module("Foo")).equals(foo);
        }
      );

      clone("should not have name if not passed a name parameter", function() {
        let childInst = instance.module();
        clone(childInst.container.CONTAINER_NAME).equals(undefined);
      });
      clone(
        "should make the instance name available when a name is passed",
        function() {
          let childInst = instance.module("Baz");
          clone(childInst.container.CONTAINER_NAME).equals("Baz");
        }
      );
      clone(
        "should return the same instance when a name is passed, even if the string == false",
        function() {
          clone(instance.module("")).equals(instance.module(""));
          clone(instance.module("0")).equals(instance.module("0"));
        }
      );
    });
  });
  clone.run();
}(o);
