import ImageGenerator from './imageGenerator.js';
import BaseCanvas from '../lib/baseCanvas.js';
import Rect from '../lib/rect.js';
import { PI2 } from './utils.js';

export default class DuplicateDraw extends BaseCanvas {
  static MAX_CIRCLES_PER_FRAME = 10;

  static IMG_POS_LEFT = 150;
  static IMAGE_WIDTH = 300;
  static IMAGE_MOVING_SPEED = 2;

  static FPS_SETTING = 10;
  static FPS_TIME_SETTING = 1000 / DuplicateDraw.FPS_SETTING;
  static SETTING_VELOCITY = 1.03;

  static MAX_RADIUS = 200;
  static MIN_RADIUS = 10;

  #imageGenerator;
  #maxParticlesIndex;
  #particles;
  #prevTimeForSpeed;
  #circlesPerFrame;
  #speedForMaxRadius;
  #speedForCirclesPerFrame;
  #maxRadius;

  constructor(imgList) {
    super();

    const imgRect = new Rect(DuplicateDraw.IMG_POS_LEFT, 0, DuplicateDraw.IMAGE_WIDTH, 0); // prettier-ignore
    this.#imageGenerator = new ImageGenerator(imgList, imgRect, DuplicateDraw.IMAGE_MOVING_SPEED); // prettier-ignore

    this.resize();
    this.#setParticles();
  }

  init() {
    this.#prevTimeForSpeed = 0;
    this.#circlesPerFrame = 1;
    this.#speedForMaxRadius = 2;
    this.#speedForCirclesPerFrame = 0.2;
    this.#maxRadius = DuplicateDraw.MAX_RADIUS;
  }

  bringToStage() {
    this.init();
    this.resize();

    super.bringToStage();
    this.#imageGenerator.bringToStage();
  }

  removeFromStage() {
    this.#imageGenerator.removeFromStage();
    super.removeFromStage();
  }

  resize() {
    super.resize();
    this.#imageGenerator.resize();

    this.init();
  }

  animate(curTime) {
    this.#checkFPSTimeForSetting(curTime);
    this.#drawBackground();
    this.#imageGenerator.isDisappeared && this.#changeNextImage();
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
    if (this.#imageGenerator) {
      this.#imageGenerator.clearCanvas();
      this.#imageGenerator.drawMovingImage();

      let randomIndex = 0;
      let particle;
      let isOnceInTow;

      for (let i = 0; i < this.#circlesPerFrame; i++) {
        randomIndex = Math.round(Math.random() * this.#maxParticlesIndex);
        particle = this.#particles[randomIndex];
        isOnceInTow = i % 2;

        this.#drawParticle(particle);
        isOnceInTow && this.#imageGenerator.drawLineToParticle(particle);
      }
    }
  }

  #drawParticle(particle) {
    let randomRadius;

    randomRadius = Math.random() * this.#maxRadius + DuplicateDraw.MIN_RADIUS;

    this.beginPath();
    this.setFillStyle(particle.color);
    this.arc(particle.x, particle.y, randomRadius, 0, PI2);
    this.fill();
  }

  #changeNextImage() {
    this.clearCanvas();
    this.#imageGenerator.nextImage();
    this.init();
    this.#setParticles();
  }

  #setParticles() {
    this.#particles = [];
    this.#particles = this.#imageGenerator.getImgParticleInfo();
    this.#maxParticlesIndex =
      this.#particles.length > 1 ? this.#particles.length - 1 : 0;
  }
}
