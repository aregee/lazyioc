import { mix } from './mixin';

import { Container, ProviderMixin, ServiceMixin, FactoryMixin, DecorateMixin, ConstantMixin, MiddlewareMixin, ValueMixin } from './mixins';


const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, uuid);

export class LazyIoc extends mix(Container).with(ProviderMixin, ServiceMixin, FactoryMixin, DecorateMixin, ValueMixin, MiddlewareMixin, ConstantMixin) {
  constructor(name) {
    super(name);
}

  /**
   * Iterator used to walk down a nested object.
   *
   * If Module.config.strict is true, this method will throw an exception if it encounters an
   * undefined path
   *
   * @param Object obj
   * @param String prop
   * @return mixed
   * @throws Error if Container is unable to resolve the requested service.
   */
  getNested(obj, prop) {
    let service = obj[prop] ? obj[prop]: obj.container[prop];
    if (service === undefined && LazyIoc.config.strict) {
      throw new Error('Container was unable to resolve a service.  `' + prop + '` is undefined.');
    }
    return service;
  }

  /**
   * Get a nested Module. Will set and return if not set.
   *
   * @param String name
   * @return Module
   */
  getNestedModule(name) {
    return this.nested[name] || (this.nested[name] = this.module());
  }

  /**
   * Get a service stored under a nested key
   *
   * @param String fullname
   * @return Service
   */
  getNestedService(fullname) {
    return fullname.split('.').reduce(this.getNested.bind(this), this);
  }


  /**
   * Get an instance of Container.
   *
   * If a name is provided the instance will be stored in a local hash.  Calling Module.pop multiple
   * times with the same name will return the same instance.
   *
   * @param String name
   * @return Module
   */

  module(name) {
    if (typeof name === 'string') {
      let instance = this.modules[name];
      if (!instance) {
        instance = new LazyIoc(name);
        this.modules[name] = instance;
        instance.constant('CONTAINER_NAME', name);
      }
      return instance;
    }

    return new LazyIoc();
  }

  static getModule(name) {
    if (typeof name === 'string') {
      let instance = LazyIoc.Singleton || this.modules[name];
      if (!instance) {
        instance = new LazyIoc(name);
        LazyIoc.Singleton = instance;
        this.modules[name] = instance;
        instance.constant('CONTAINER_NAME', name);
      }
      return instance;
    }
    if(LazyIoc.Singleton) {
      return LazyIoc.Singleton;
    } else {
      return new LazyIoc(name);
    }
  }
}
LazyIoc.config = {strict:true};
LazyIoc.Singleton = null;