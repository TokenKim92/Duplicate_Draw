import BackgroundGenerator from './backgroundGenerator.js';
import ImageGenerator from './imageGenerator.js';

export default class DuplicateDraw {
  static MAX_CIRCLES_PER_FRAME = 10;

  static IMG_POS_LEFT = 150;
  static IMAGE_WIDTH = 300;
  static IMAGE_MOVING_SPEED = 3;

  static DRAW_FPS = 40;
  static DRAW_FPS_TIME = 1000 / DuplicateDraw.DRAW_FPS;
  static SETTING_FPS = 5;
  static SETTING_FPS_TIME = 1000 / DuplicateDraw.SETTING_FPS;

  static SETTING_VELOCITY = 1.03;

  #bgGenerator;
  #imageGenerator;
  #stageWidth;
  #stageHeight;
  #img;
  #prevTimeForAnimate = 0;
  #prevTimeForSpeed = 0;
  #maxParticlesIndex;
  #particles;
  #circlesPerFrame = 1;
  #speedForMaxRadius = 2;
  #speedForCirclesPerFrame = 0.2;

  constructor(imgUrl) {
    this.#bgGenerator = new BackgroundGenerator();

    this.#img = new Image();
    this.#img.src = imgUrl;

    this.#img.onload = () => {
      this.#imageGenerator = new ImageGenerator(
        this.#img,
        {
          x: DuplicateDraw.IMG_POS_LEFT,
          width: DuplicateDraw.IMAGE_WIDTH,
        },
        DuplicateDraw.IMAGE_MOVING_SPEED
      );

      this.resize();

      this.#particles = this.#imageGenerator.getImgParticleInfo();
      this.#maxParticlesIndex = this.#particles.length - 1;

      window.requestAnimationFrame(this.animate);
    };

    window.addEventListener('resize', this.resize);

    WebFont.load({
      google: {
        families: ['Hind:700'],
      },
    });
  }

  resize = () => {
    this.#stageWidth = document.documentElement.clientWidth;
    this.#stageHeight = document.documentElement.clientHeight;

    this.#imageGenerator.resize(this.#stageWidth, this.#stageHeight);
    this.#bgGenerator.resize(this.#stageWidth, this.#stageHeight);
  };

  animate = (curTime) => {
    this.checkFPSTimeForSetting(curTime);

    const isRepeatable = this.checkFPSTimeToDraw(curTime);

    if (isRepeatable) {
      window.requestAnimationFrame(this.animate);
    } else {
      this.#imageGenerator.clearCanvas();
      this.#imageGenerator.drawImage();
    }
  };

  checkFPSTimeForSetting(curTime) {
    if (!this.#prevTimeForSpeed) {
      this.#prevTimeForSpeed = curTime;
    }

    if (curTime - this.#prevTimeForSpeed > DuplicateDraw.SETTING_FPS_TIME) {
      this.#prevTimeForSpeed = curTime;

      this.onFPSTimeForSetting();
    }
  }

  onFPSTimeForSetting() {
    this.#speedForMaxRadius *= DuplicateDraw.SETTING_VELOCITY;
    this.#speedForCirclesPerFrame *= DuplicateDraw.SETTING_VELOCITY;

    if (this.#bgGenerator.maxRandomRadius > this.#bgGenerator.minRandomRadius) {
      this.#bgGenerator.maxRandomRadius -= this.#speedForMaxRadius;
    }

    if (this.#circlesPerFrame < DuplicateDraw.MAX_CIRCLES_PER_FRAME) {
      this.#circlesPerFrame += this.#speedForCirclesPerFrame;
    }
  }

  checkFPSTimeToDraw(curTime) {
    if (!this.#prevTimeForAnimate) {
      this.#prevTimeForAnimate = curTime;
    }

    if (curTime - this.#prevTimeForAnimate > DuplicateDraw.DRAW_FPS_TIME) {
      this.#prevTimeForAnimate = curTime;

      return this.onFPSTimeToDraw();
    }

    return true;
  }

  onFPSTimeToDraw() {
    this.#imageGenerator.clearCanvas();
    const isRepeatable = this.#imageGenerator.drawImage();

    let randomIndex = 0;
    let particle;
    for (let i = 0; i < this.#circlesPerFrame; i++) {
      randomIndex = Math.round(Math.random() * this.#maxParticlesIndex);
      particle = this.#particles[randomIndex];

      this.#bgGenerator.drawParticle(particle);
      this.#imageGenerator.drawLineToParticle(particle);
    }

    return isRepeatable;
  }
}

window.onload = () => {
  new DuplicateDraw();
};
