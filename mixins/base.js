const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, uuid);

export class Container {
  constructor(name, store={}) {
    this.name = name;
    this.modules = store;
    this.decorators = {};
    this.nested = {};
    this.providerMap = {};
    this.originalProviders = {};
    this.middlewares = {};
    this.deferred = [];
    let register = this.register.bind(this);
    let decorator = this.decorator.bind(this);
    this.container = {
      $decorator : decorator,
      $register : register,
      $list : this.list.bind(this)
    };
    this.config = {
      strict: false
    };
    this.id = uuid;
    if (this.modules[name]) {
      return this.module(name);
    }
  }
  /**
   * Clear all named modules.
   */
  clear(name) {
    if (typeof name === 'string') {
      delete this.modules[name];
    } else {
      this.modules = {};
    }
  }

  /**
   * A filter function for removing Module container methods and providers from a list of keys
   */
  byMethod(name) {
    return !/^\$(?:decorator|register|list)$|Provider$/.test(name);
  }

  /**
   * List the services registered on the container.
   *
   * @param Object container
   * @return Array
   */
  list(container) {
    return Object.keys(container || this.container || {}).filter(this.byMethod);
  }


  /**
   * Immediately instantiates the provided list of services and returns them.
   *
   * @param Array services
   * @return Array Array of instances (in the order they were provided)
   */
  digest(services) {
    return (services || []).map(this.getNestedService.bind(this), this.container);
  }

}
