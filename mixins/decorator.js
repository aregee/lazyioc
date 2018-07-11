export const DecorateMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
  }

  /**
   * Register decorator.
   *
   * @param String fullname
   * @param Function func
   * @return Module
   */
  decorator(fullname, func) {

    if (typeof fullname === 'function') {
      func = fullname;
      fullname = '__global__';
    }

    let parts = fullname.split('.');
    let name = parts.shift();
    if (parts.length) {
      this.getNestedModule.call(this, name).decorator(parts.join('.'), func);
    } else {
      if (!this.decorators[name]) {
        this.decorators[name] = [];
      }
      this.decorators[name].push(func);
    }
    return this;
  }

  /**
   * Register a function that will be executed when Module#resolve is called.
   *
   * @param Function func
   * @return Module
   */
  defer(func) {
    this.deferred.push(func);
    return this;
  }
}
