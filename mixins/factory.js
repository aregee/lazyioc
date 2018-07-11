export const FactoryMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
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
