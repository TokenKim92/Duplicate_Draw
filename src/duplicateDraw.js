import BackgroundGenerator from './backgroundGenerator.js';
import ImageGenerator from './imageGenerator.js';
import Rect from '../lib/rect.js';

export default class DuplicateDraw {
  static MAX_CIRCLES_PER_FRAME = 10;

  static IMG_POS_LEFT = 150;
  static IMAGE_WIDTH = 300;
  static IMAGE_MOVING_SPEED = 2;

  static FPS_SETTING = 5;
  static FPS_TIME_SETTING = 1000 / DuplicateDraw.FPS_SETTING;
  static SETTING_VELOCITY = 1.01;

  #bgGenerator;
  #imageGenerator;
  #prevTimeForSpeed = 0;
  #maxParticlesIndex;
  #particles;
  #circlesPerFrame = 1;
  #speedForMaxRadius = 2;
  #speedForCirclesPerFrame = 0.2;

  #isImgLoaded = false;

  constructor(imgUrl) {
    this.#bgGenerator = new BackgroundGenerator();
    const img = new Image();
    img.src = imgUrl;

    img.onload = () => {
      this.onImgLoad(img);
    };
  }

  onImgLoad(img) {
    const imgRect = new Rect(DuplicateDraw.IMG_POS_LEFT, 0, DuplicateDraw.IMAGE_WIDTH, 0); // prettier-ignore
    this.#imageGenerator = new ImageGenerator(img, imgRect, DuplicateDraw.IMAGE_MOVING_SPEED); // prettier-ignore

    this.resize();
    this.#particles = this.#imageGenerator.getImgParticleInfo();
    this.#maxParticlesIndex = this.#particles.length - 1;

    this.#isImgLoaded = true;
  }

  resize() {
    this.#imageGenerator.resize();
    this.#bgGenerator.resize();
  }

  animate(curTime) {
    this.checkFPSTimeForSetting(curTime);
    this.drawBackground();
  }

  checkFPSTimeForSetting(curTime) {
    if (!this.#prevTimeForSpeed) {
      this.#prevTimeForSpeed = curTime;
    }

    if (curTime - this.#prevTimeForSpeed > DuplicateDraw.FPS_TIME_SETTING) {
      this.#prevTimeForSpeed = curTime;

      this.onFPSTimeForSetting();
    }
  }

  onFPSTimeForSetting() {
    this.#speedForMaxRadius *= DuplicateDraw.SETTING_VELOCITY;
    this.#speedForCirclesPerFrame *= DuplicateDraw.SETTING_VELOCITY;

    if (this.#bgGenerator.maxRadius > BackgroundGenerator.MIN_RADIUS) {
      this.#bgGenerator.maxRadius -= this.#speedForMaxRadius;
    }

    if (this.#circlesPerFrame < DuplicateDraw.MAX_CIRCLES_PER_FRAME) {
      this.#circlesPerFrame += this.#speedForCirclesPerFrame;
    }
  }

  drawBackground() {
    this.#imageGenerator.clearCanvas();
    this.#imageGenerator.drawImage();

    let randomIndex = 0;
    let particle;

    for (let i = 0; i < this.#circlesPerFrame; i++) {
      randomIndex = Math.round(Math.random() * this.#maxParticlesIndex);
      particle = this.#particles[randomIndex];

      this.#bgGenerator.drawParticle(particle);
      this.#imageGenerator.isDisappeared || this.#imageGenerator.drawLineToParticle(particle); // prettier-ignore
    }
  }

  get isImgLoaded() {
    return this.#isImgLoaded;
  }
}
