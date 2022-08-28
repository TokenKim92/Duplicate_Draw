import BaseCanvas from '../lib/baseCanvas.js';
import FontFormat from '../lib/fontFormat.js';
import Rect from '../lib/rect.js';
import { PI2 } from './utils.js';

export default class ImageGenerator extends BaseCanvas {
  static LINE_COLOR = 'rgb(0, 0, 0)';
  static BG_THICKNESS = 6;
  static BG_HALF_THICKNESS = ImageGenerator.BG_THICKNESS / 2;
  static BG_COLOR = 'rgba(255, 255, 255, 0.9)';
  static TITLE = 'GOGH';
  static SUB_TITLE = "Inspired by 'Interactive Developer'";

  #imageList = [];
  #currentImage;
  #imgRect;
  #imgToStageRatio;
  #movingSpeed;
  #titleFont;
  #subTitleFont;
  #currentImageIndex;
  #prevSizeMode = BaseCanvas.INIT_MODE;

  constructor(imageList, movingSpeed) {
    super();

    this.#imageList = imageList;
    this.#movingSpeed = movingSpeed;
    this.#currentImageIndex = 0;

    this.nextImage();
  }

  nextImage() {
    this.#currentImage = this.#imageList[this.#currentImageIndex];
    this.#currentImageIndex = (this.#currentImageIndex + 1) % this.#imageList.length; // prettier-ignore
    this.resize();
  }

  resize() {
    super.resize();

    this.#initFont();
    this.#setImageRect();
  }

  #initFont() {
    if (this.#prevSizeMode === this.sizeMode) {
      return;
    }

    this.#prevSizeMode = this.sizeMode;
    let titleFontSize = 0;
    let subTitleFontSize = 0;

    switch (this.sizeMode) {
      case BaseCanvas.SMALL_MODE:
        titleFontSize = 100;
        subTitleFontSize = 20;
        break;
      case BaseCanvas.REGULAR_MODE:
        titleFontSize = 200;
        subTitleFontSize = 30;
        break;
      case BaseCanvas.MEDIUM_MODE:
        titleFontSize = 300;
        subTitleFontSize = 40;
        break;
      case BaseCanvas.LARGE_MODE:
        titleFontSize = 400;
        subTitleFontSize = 50;
        break;
      default:
        throw new Error('This canvas size is not possible!');
    }

    this.#titleFont = new FontFormat(800, titleFontSize, 'Arial');
    this.#subTitleFont = new FontFormat(600, subTitleFontSize, 'Arial');
  }

  #setImageRect() {
    const targetImageWidth = Math.floor(this.stageWidth / 4);
    const leftPos = targetImageWidth / 2;

    this.#imgRect = new Rect(
      leftPos, this.stageHeight,
      targetImageWidth, targetImageWidth * (this.#currentImage.height / this.#currentImage.width)
    ); // prettier-ignore

    if (this.#currentImage.width > this.#currentImage.height) {
      const ratio = this.stageWidth / this.#imgRect.width;
      this.#imgToStageRatio = {
        x: 0,
        y: Math.round((this.stageHeight - this.#imgRect.height * ratio) / 2),
        ratio: ratio,
      };
    } else {
      const ratio = this.stageHeight / this.#imgRect.height;
      this.#imgToStageRatio = {
        x: Math.round((this.stageWidth - this.#imgRect.width * ratio) / 2),
        y: 0,
        ratio: ratio,
      };
    }
  }

  getImgParticleInfo() {
    this.ctx.drawImage(
      this.#currentImage,
      0, 0, this.#currentImage.width, this.#currentImage.height,
      0, 0, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    const imageData = this.ctx.getImageData(0, 0, this.#imgRect.width, this.#imgRect.height).data; // prettier-ignore
    let particles = [];
    let pixelIndex;

    for (let y = 0; y < this.#imgRect.height; y++) {
      for (let x = 0; x < this.#imgRect.width; x++) {
        pixelIndex = (x + y * this.#imgRect.width) * 4;

        particles.push({
          x: x * this.#imgToStageRatio.ratio + this.#imgToStageRatio.x,
          y: y * this.#imgToStageRatio.ratio + this.#imgToStageRatio.y,
          color: `rgb(${imageData[pixelIndex]}, ${imageData[pixelIndex + 1]}, ${imageData[pixelIndex + 2]})`,
        }); // prettier-ignore
      }
    }

    this.clearCanvas();

    return particles;
  }

  drawLineToParticle(particle) {
    this.ctx.save();

    this.ctx.strokeStyle = ImageGenerator.LINE_COLOR;
    this.ctx.beginPath();

    const posOnImage = {
      x : this.#imgRect.x + (particle.x - this.#imgToStageRatio.x) / this.#imgToStageRatio.ratio,
      y: this.#imgRect.y + (particle.y - this.#imgToStageRatio.y) / this.#imgToStageRatio.ratio,
    }; // prettier-ignore

    this.ctx.moveTo(particle.x, particle.y);
    this.ctx.lineTo(posOnImage.x, posOnImage.y);
    this.ctx.stroke();

    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(posOnImage.x, posOnImage.y, 4, 0, PI2);

    this.ctx.fill();

    this.ctx.restore();
  }

  drawMovingImage() {
    this.#drawTitle();
    this.#drawSubTitle();
    this.#drawBackground();

    this.ctx.drawImage(
      this.#currentImage,
      0, 0, this.#currentImage.width, this.#currentImage.height,
      this.#imgRect.x, this.#imgRect.y, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    this.#imgRect.y -= this.#movingSpeed;
  }

  #drawTitle() {
    this.ctx.save();

    this.ctx.font = this.#titleFont.font;
    this.ctx.fillStyle = ImageGenerator.BG_COLOR;

    const fontPos = this.ctx.measureText(ImageGenerator.TITLE);
    this.ctx.fillText(
      ImageGenerator.TITLE,
      (this.stageWidth - fontPos.width) / 2,
      (this.stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2
    ); // prettier-ignore

    this.ctx.restore();
  }

  #drawSubTitle() {
    this.ctx.save();

    this.ctx.font = this.#subTitleFont.font;
    this.ctx.fillStyle = ImageGenerator.BG_COLOR;
    this.ctx.textBaseline = 'middle';

    const fontPos = this.ctx.measureText(ImageGenerator.SUB_TITLE);
    this.ctx.fillText(ImageGenerator.SUB_TITLE, (this.stageWidth - fontPos.width) / 2, 50); // prettier-ignore

    this.ctx.restore();
  }

  #drawBackground() {
    this.ctx.save();

    this.ctx.fillStyle = ImageGenerator.BG_COLOR;
    this.ctx.fillRect(
      this.#imgRect.x - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgRect.y - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgRect.width + ImageGenerator.BG_THICKNESS,
      this.#imgRect.height + ImageGenerator.BG_THICKNESS
    );

    this.ctx.restore();
  }

  get isDisappeared() {
    return this.#imgRect.y + this.#imgRect.height * 1.2 < 0;
  }
}
