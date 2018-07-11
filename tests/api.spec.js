const o = require("ospec");
const { LazyIoc } = require("../bundle");

new function(o) {
  let clone = o.new();

  clone.spec("lazyioc API", function() {
    const lazyIoc = new LazyIoc();
    o.beforeEach(function() {
      acc = 0;
    });

    clone(
      "expect lazyIoc to have a global property object 'config' ",
      function() {
        clone(typeof lazyIoc.config === "object").equals(true)(
          "lazyIoc should be an object"
        );
      }
    );
    clone("expect config.strict to be a bool property", function() {
      clone(lazyIoc.config.strict).equals(false)("Should be boolean");
    });

    clone("expect lazyIoc to expose a constant which is a function", () => {
      clone(typeof lazyIoc.constant).equals("function");
    });
    clone("expect lazyIoc to expose a decorator which is a function", () => {
      clone(typeof lazyIoc.decorator).equals("function");
    });
    clone("expect lazyIoc to expose a defer which is a function", () => {
      clone(typeof lazyIoc.defer).equals("function");
    });
    clone("expect lazyIoc to expose a digest which is a function", () => {
      clone(typeof lazyIoc.digest).equals("function");
    });
    clone("expect lazyIoc to expose a factory which is a function", () => {
      clone(typeof lazyIoc.factory).equals("function");
    });
    clone("expect lazyIoc to expose a provider which is a function", () => {
      clone(typeof lazyIoc.provider).equals("function");
    });

    clone(
      "expect lazyIoc to expose a instanceFactory which is a function",
      () => {
        clone(typeof lazyIoc.instanceFactory).equals("function");
      }
    );

    clone("expect lazyIoc to expose a list which is a function", () => {
      clone(typeof lazyIoc.list).equals("function");
    });

    clone("expect lazyIoc to expose a middleware which is a function", () => {
      clone(typeof lazyIoc.middleware).equals("function");
    });

    clone("expect lazyIoc to expose a register function", () => {
      clone(typeof lazyIoc.register).equals("function");
    });

    clone("expect lazyIoc to expose a resolve function", () => {
      clone(typeof lazyIoc.resolve).equals("function");
    });

    clone("epect lazyIoc to expose a service function", () => {
      clone(typeof lazyIoc.service).equals("function");
    });

    clone("expose value", function() {
      clone(typeof lazyIoc.value).equals("function");
    });

    clone("expose container on the instance", () => {
      clone(typeof lazyIoc.container).equals("object");
    });
  });
  clone.run();
}(o);
