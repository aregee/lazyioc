export const FactoryMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
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

  /**
   * Register a factory inside a generic provider.
   *
   * @param String name
   * @param Function Factory
   * @return Module
   */
  factory(name, Factory) {
    return this.provider.call(this, name, function GenericProvider() {
      this.$get = Factory;
    });
  }

  /**
   * Register an instance factory inside a generic factory.
   *
   * @param {String} name - The name of the service
   * @param {Function} Factory - The factory function, matches the signature required for the
   * `factory` method
   * @return Module
   */
  instanceFactory(name, Factory) {
    return this.factory.call(this, name, function GenericInstanceFactory(container) {
      
      return {
        instance: Factory.bind(Factory, container)
      };
    });
  }

}
