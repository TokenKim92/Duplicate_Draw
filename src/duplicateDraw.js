import ImageGenerator from './imageGenerator.js';
import BaseCanvas from '../lib/baseCanvas.js';
import Rect from '../lib/rect.js';
import { PI2 } from './utils.js';

export default class DuplicateDraw extends BaseCanvas {
  static MAX_CIRCLES_PER_FRAME = 10;

  static IMG_POS_LEFT = 150;
  static IMAGE_WIDTH = 300;
  static IMAGE_MOVING_SPEED = 2;

  static FPS_SETTING = 5;
  static FPS_TIME_SETTING = 1000 / DuplicateDraw.FPS_SETTING;
  static SETTING_VELOCITY = 1.03;

  static MAX_RADIUS = 200;
  static MIN_RADIUS = 10;

  #imageGenerator;
  #prevTimeForSpeed = 0;
  #maxParticlesIndex;
  #particles;
  #circlesPerFrame = 1;
  #speedForMaxRadius = 2;
  #speedForCirclesPerFrame = 0.2;

  #isImgLoaded = false;
  #maxRadius = DuplicateDraw.MAX_RADIUS;

  constructor(imgUrl) {
    super();

    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      this.#onImgLoad(img);
    };
  }

  destroy() {
    this.#imageGenerator && this.#imageGenerator.destroy();
    super.destroy();
  }

  resize() {
    super.resize();
    this.#imageGenerator.resize();
  }

  animate(curTime) {
    this.#checkFPSTimeForSetting(curTime);
    this.#drawBackground();
  }

  #onImgLoad(img) {
    const imgRect = new Rect(DuplicateDraw.IMG_POS_LEFT, 0, DuplicateDraw.IMAGE_WIDTH, 0); // prettier-ignore
    this.#imageGenerator = new ImageGenerator(img, imgRect, DuplicateDraw.IMAGE_MOVING_SPEED); // prettier-ignore

    this.resize();
    this.#particles = this.#imageGenerator.getImgParticleInfo();
    this.#maxParticlesIndex = this.#particles.length - 1;

    this.#isImgLoaded = true;
  }

  #checkFPSTimeForSetting(curTime) {
    if (!this.#prevTimeForSpeed) {
      this.#prevTimeForSpeed = curTime;
    }

    if (curTime - this.#prevTimeForSpeed > DuplicateDraw.FPS_TIME_SETTING) {
      this.#prevTimeForSpeed = curTime;

      this.#onFPSTimeForSetting();
    }
  }

  #onFPSTimeForSetting() {
    this.#speedForMaxRadius *= DuplicateDraw.SETTING_VELOCITY;
    this.#speedForCirclesPerFrame *= DuplicateDraw.SETTING_VELOCITY;

    if (this.#maxRadius > DuplicateDraw.MIN_RADIUS) {
      this.#maxRadius -= this.#speedForMaxRadius;
    }

    if (this.#circlesPerFrame < DuplicateDraw.MAX_CIRCLES_PER_FRAME) {
      this.#circlesPerFrame += this.#speedForCirclesPerFrame;
    }
  }

  #drawBackground() {
    this.#imageGenerator.clearCanvas();
    this.#imageGenerator.drawImage();

    let randomIndex = 0;
    let particle;

    for (let i = 0; i < this.#circlesPerFrame; i++) {
      randomIndex = Math.round(Math.random() * this.#maxParticlesIndex);
      particle = this.#particles[randomIndex];

      this.#drawParticle(particle);
      this.#imageGenerator.isDisappeared || this.#imageGenerator.drawLineToParticle(particle); // prettier-ignore
    }
  }

  #drawParticle(particle) {
    let randomRadius;

    randomRadius = Math.random() * this.#maxRadius + DuplicateDraw.MIN_RADIUS;

    this.ctx.beginPath();
    this.ctx.fillStyle = particle.color;
    this.ctx.arc(particle.x, particle.y, randomRadius, 0, PI2);
    this.ctx.fill();
  }

  get isImgLoaded() {
    return this.#isImgLoaded;
  }
}
