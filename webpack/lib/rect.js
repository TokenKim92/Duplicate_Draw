export default class Rect {
  #x;
  #y;
  #width;
  #height;

  constructor(x, y, width, height) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
  }

  get x() {
    return this.#x;
  }

  set x(x) {
    this.#x = x;
  }

  get y() {
    return this.#y;
  }

  set y(y) {
    this.#y = y;
  }

  get width() {
    return this.#width;
  }

  set width(width) {
    this.#x = x;
  }

  get height() {
    return this.#height;
  }

  set height(height) {
    this.#height = height;
  }
}
