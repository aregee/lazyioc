const slice = Array.prototype.slice;
export const ProviderMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
  }

  /**
   * Used to process decorators in the provider
   *
   * @param Object instance
   * @param Function func
   * @return Mixed
   */
  reducer(instance, func) {
    return func(instance);
  }
  
  /**
   * Register a provider.
   *
   * @param String fullname
   * @param Function Provider
   * @return instance
   */
  provider(fullname, Provider) {

    let parts = fullname.split('.');
    if (this.providerMap[fullname] && parts.length === 1 && !this.container[fullname + 'Provider']) {
      return console.error(fullname + ' provider already instantiated.');
    }
    this.originalProviders[fullname] = Provider;
    this.providerMap[fullname] = true;

    let name = parts.shift();

    if (parts.length) {
      this.createSubProvider.call(this, name, Provider, parts);
      return this;
    }
    return this.createProvider.call(this, name, Provider);
  }

  /**
   * Get decorators and middleware including globals
   *
   * @return array
   */
  getWithGlobal(collection, name) {
    return (collection[name] || []).concat(collection.__global__ || []);
  }

  /**
   * Create the provider properties on the container
   *
   * @param String name
   * @param Function Provider
   * @return instance
   */
  createProvider(name, Provider) {
    let id = this.id();
    let container = this.container;
    let decorators = this.decorators;
    let middlewares = this.middlewares;
    let providerName = name + 'Provider';

    let properties = Object.create(null);
    properties[providerName] = {
      configurable: true,
      enumerable: true,
      get: function getProvider() {
        let instance = new Provider();
        delete container[providerName];
        container[providerName] = instance;
        return instance;
      }
    };
    let getService = function getService(name, providerName) {
      let provider = this.container[providerName];
      let instance;
      if (provider) {
        // filter through decorators
      instance = this.getWithGlobal(this.decorators, name).reduce(this.reducer, provider.$get(this.container));

        delete container[providerName];
        delete container[name];
      }
      return instance === undefined ? instance : this.applyMiddleware(this.getWithGlobal(this.middlewares, name),
        name, instance, this.container);
    }

    let boundeGetService = getService.bind(this, name, providerName);


    properties[name] = {
      configurable: true,
      enumerable: true,
      get: boundeGetService
    };

    Object.defineProperties(container, properties);
    return this;
  }

  /**
   * Creates a iocinstance container on the current iocinstance container, and registers
   * the provider under the sub container.
   *
   * @param String name
   * @param Function Provider
   * @param Array parts
   * @return instance
   */
  createSubProvider(name, Provider, parts) {

    let iocinstance = this.getNestedModule.call(this, name);
    this.factory(name, function SubProviderFactory() {
      return iocinstance.container;
    });
    return iocinstance.provider(parts.join('.'), Provider);
  }

  /**
   * Register a service, factory, provider, or value based on properties on the object.
   *
   * properties:
   *  * Obj.$name   String required ex: `'Thing'`
   *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
   *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
   *  * Obj.$value  Mixed  optional Normally Obj is registered on the container.  However, if this
   *                       property is included, it's value will be registered on the container
   *                       instead of the object itsself.  Useful for registering objects on the
   *                       iocinstance container without modifying those objects with iocinstance specific keys.
   *
   * @param Function Obj
   * @return instance
   */
  register(Obj) {
    var value = Obj.$value === undefined ? Obj : Obj.$value;
    return this[Obj.$type || 'service'].apply(this, [Obj.$name, value].concat(Obj.$inject || []));
  }

  /**
   * Deletes providers from the map and container.
   *
   * @param String name
   * @return void
   */
  removeProviderMap(name) {
    delete this.providerMap[name];
    delete this.container[name];
    delete this.container[name + 'Provider'];
  }

  /**
   * Resets all providers on a iocinstance instance.
   *
   * @return void
   */
  resetProviders() {
    let providers = this.originalProviders;
    Object.keys(this.originalProviders).forEach(function resetPrvider(provider) {
      let parts = provider.split('.');
      if (parts.length > 1) {
        this.removeProviderMap.call(this, parts[0]);
        parts.forEach(this.removeProviderMap, this.getNestedModule.call(this, parts[0]));
      }
      this.removeProviderMap.call(this, provider);
      this.provider(provider, providers[provider]);
    }, this);
  };


  /**
   * Execute any deferred functions
   *
   * @param Mixed data
   * @return Module
   */
  resolve(data) {
    this.deferred.forEach(function deferredIterator(func) {
      func(data);
    });

    return this;
  }


  /**
   * Register a service inside a generic factory.
   *
   * @param String name
   * @param Function Service
   * @return Module
   */
  service(name, Service) {
    let deps = arguments.length > 2 ? slice.call(arguments, 2) : null;
    let iocinstance = this;
    return this.factory.call(this, name, function GenericFactory() {
      let ServiceCopy = Service;
      if (deps) {
        let args = deps.map(this.getNestedService.bind(iocinstance), iocinstance.container);
        args.unshift(Service);
        ServiceCopy = Service.bind.apply(Service, args);
      }
      return new ServiceCopy();
    });
  }
}
