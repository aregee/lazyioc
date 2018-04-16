
export const ValueMixin = (superclass) => class extends superclass {
  constructor(name) {
    super(name);

  }
  /**
   * Register a value
   *
   * @param String name
   * @param mixed val
   * @return superclass
   */
   value(name, val) {
    let parts = name.split('.');
    name = parts.pop();
    this.defineValue.call(parts.reduce(this.setValueObject, this.container), name, val);
    return this;
  }

  /**
   * Iterator for setting a plain object literal via defineValue
   *
   * @param Object container
   * @param string name
   */
  setValueObject(container, name) {
    let nestedContainer = container[name];
    if (!nestedContainer) {
      nestedContainer = {};
      this.defineValue.call(container, name, nestedContainer);
    }
    return nestedContainer;
  }

  /**
   * Define a mutable property on the container.
   *
   * @param String name
   * @param mixed val
   * @return void
   * @scope container
   */

  defineValue(name, val) {
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: true,
      value: val,
      writable: true
    });
  }

}
