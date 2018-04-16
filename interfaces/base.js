
export class Container {
  constructor(name) {
    if (!(this instanceof Container)) {
      return Container.module(name);
    }
  }
}
