const slice = Array.prototype.slice;
export const ServiceMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
  }

  /**
   * Register a class service
   *
   * @param String name
   * @param Function Service
   * @return LazyIoc
   */
  service(name, Service) {
      return this.createService.apply(this, [name, Service, true].concat(slice.call(arguments, 2)));
  }


  /**
   * Register a service inside a generic factory.
   *
   * @param String name
   * @param Function Service
   * @return Module
   */
  createService(name, Service, isClass) {
    let deps = arguments.length > 3 ? slice.call(arguments, 3) : [];
    let iocinstance = this;
    return this.factory.call(this, name, function GenericFactory() {
      let serviceFactory = Service;
      let nestedService = iocinstance.getNestedService.bind(iocinstance)
      let args = deps.map(nestedService, iocinstance.container);
      if (!isClass) {
        return serviceFactory.apply(null, args);
      }
      args.unshift(Service);
      return new (Service.bind.apply(Service, args));
    });
  }

  serviceFactory(name, factoryService) {
    return this.createService.apply(this, [name, factoryService, false].concat(slice.call(arguments, 2)));
  }
}
