
export const ConstantMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);
  }
  /**
   * Register a constant
   *
   * @param String name
   * @param mixed value
   * @return Module
   */
  constant(name, value) {
    let parts = name.split('.');
    name = parts.pop();
    this.defineConstant.call(parts.reduce(this.setValueObject, this.container), name, value);
    return this;
  }

  defineConstant(name, value) {
    Object.defineProperty(this, name, {
      configurable: false,
      enumerable: true,
      value: value,
      writable: false
    });
  }
}
