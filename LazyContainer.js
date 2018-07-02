import { mix } from './mixin';

import { Container, ProviderMixin, FactoryMixin, DecorateMixin, ConstantMixin, MiddlewareMixin, ValueMixin } from './interfaces';


const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, uuid);

export class AppShell extends mix(Container).with(ProviderMixin, FactoryMixin, DecorateMixin, ConstantMixin, ValueMixin, MiddlewareMixin) {
  constructor(name) {
    super(name);
    this.config = {
      strict: false
    };
    this.id = uuid;
    this.modules = {};
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
    let service = obj[prop];
    if (service === undefined && this.config.strict) {
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
    return this.nested[name] || (this.nested[name] = AppShell.module());
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

  static module(name) {
    if (typeof name === 'string') {
      let instance = this.modules[name];
      if (!instance) {
        this.modules[name] = instance = new AppShell(name);
        instance.constant('CONTAINER_NAME', name);
      }
      return instance;
    }
    return new AppShell(name);
  }

  /**
   * Clear all named modules.
   */
  static clear(name) {
    if (typeof name === 'string') {
      delete this.modules[name];
    } else {
      this.modules = {};
    }
  }

}
