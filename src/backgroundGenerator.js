import { PI2 } from './utils.js';

export default class BackgroundGenerator {
  #canvas;
  #ctx;
  #maxRandomRadius = 200;
  #minRandomRadius = 10;

  constructor() {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);
  }

  resize = (stageWidth, stageHeight) => {
    this.#canvas.width = stageWidth;
    this.#canvas.height = stageHeight;
  };

  drawParticle = (particle) => {
    let randomRadius;

    randomRadius =
      Math.random() * this.#maxRandomRadius + this.#minRandomRadius;

    this.#ctx.beginPath();
    this.#ctx.fillStyle = particle.color;
    this.#ctx.arc(particle.x, particle.y, randomRadius, 0, PI2);
    this.#ctx.fill();
  };

  get maxRandomRadius() {
    return this.#maxRandomRadius;
  }

  set maxRandomRadius(maxRandomRadius) {
    this.#maxRandomRadius = maxRandomRadius;
  }

  get minRandomRadius() {
    return this.#minRandomRadius;
  }

  set minRandomRadius(minRandomRadius) {
    this.#minRandomRadius = minRandomRadius;
  }
}
