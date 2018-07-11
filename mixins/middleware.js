
export const MiddlewareMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
  }

  /**
   * Function used by provider to set up middleware for each request.
   *
   * @param Number id
   * @param String name
   * @param Object instance
   * @param Object container
   * @return void
   */
  applyMiddleware(middleware, name, instance, container) {
    let descriptor = {
      configurable: true,
      enumerable: true
    };
    if (middleware.length) {
      descriptor.get = function getWithMiddlewear() {
        var index = 0;
        var next = function nextMiddleware(err) {
          if (err) {
            throw err;
          }
          if (middleware[index]) {
            middleware[index++](instance, next);
          }
        };
        next();
        return instance;
      };
    } else {
      descriptor.value = instance;
      descriptor.writable = true;
    }

    Object.defineProperty(container, name, descriptor);

    return container[name];
  };

  /**
   * Register middleware.
   *
   * @param String name
   * @param Function func
   * @return Module
   */
  middleware(fullname, func) {
    if (typeof fullname === 'function') {
      func = fullname;
      fullname = '__global__';
    }

    let parts = fullname.split('.');
    let name = parts.shift();
    if (parts.length) {
      this.getNestedModule.call(this, name).middleware(parts.join('.'), func);
    } else {
      if (!this.middlewares[name]) {
        this.middlewares[name] = [];
      }
      this.middlewares[name].push(func);
    }
    return this;
  }
}
