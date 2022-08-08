import BaseCanvas from '../lib/baseCanvas.js';
import { PI2 } from './utils.js';

export default class BackgroundGenerator extends BaseCanvas {
  static MAX_RADIUS = 200;
  static MIN_RADIUS = 10;

  #maxRadius = BackgroundGenerator.MAX_RADIUS;

  constructor() {
    super();
  }

  drawParticle(particle) {
    let randomRadius;

    randomRadius =
      Math.random() * this.#maxRadius + BackgroundGenerator.MIN_RADIUS;

    this.ctx.beginPath();
    this.ctx.fillStyle = particle.color;
    this.ctx.arc(particle.x, particle.y, randomRadius, 0, PI2);
    this.ctx.fill();
  }

  get maxRadius() {
    return this.#maxRadius;
  }

  set maxRadius(maxRadius) {
    this.#maxRadius = maxRadius;
  }
}
