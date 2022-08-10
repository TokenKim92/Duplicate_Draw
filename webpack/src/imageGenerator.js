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

  #img;
  #imgRect;
  #imgToStageRatio;
  #movingSpeed;
  #titleFont;
  #subTitleFont;

  constructor(img, posInfo, movingSpeed) {
    super();

    this.#img = img;
    this.#imgRect = new Rect(posInfo.x, 0, posInfo.width, posInfo.width * (this.#img.height / this.#img.width)); // prettier-ignore
    this.#movingSpeed = movingSpeed;
    this.#titleFont = new FontFormat(800, 300, 'Arial');
    this.#subTitleFont = new FontFormat(600, 40, 'Arial');
  }

  resize() {
    super.resize();

    this.#imgRect.y = this.stageHeight;

    this.#imgToStageRatio = {
      x: this.stageWidth / this.#imgRect.width,
      y: this.stageHeight / this.#imgRect.height,
    };
  }

  getImgParticleInfo() {
    this.drawImage(
      this.#img,
      0, 0, this.#img.width, this.#img.height,
      0, 0, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    const imageData = this.getImageData(0, 0, this.#imgRect.width, this.#imgRect.height).data; // prettier-ignore

    let particles = [];
    let pixelIndex;

    for (let y = 0; y < this.#imgRect.height; y++) {
      for (let x = 0; x < this.#imgRect.width; x++) {
        pixelIndex = (x + y * this.#imgRect.width) * 4;

        particles.push({
          x: x * this.#imgToStageRatio.x,
          y: y * this.#imgToStageRatio.y,
          color: `rgb(${imageData[pixelIndex]}, ${imageData[pixelIndex + 1]}, ${imageData[pixelIndex + 2]})`,
        }); // prettier-ignore
      }
    }

    return particles;
  }

  drawLineToParticle(particle) {
    this.saveCanvas();

    this.setStrokeStyle(ImageGenerator.LINE_COLOR);
    this.beginPath();

    this.moveTo(particle.x, particle.y);
    this.lineTo(
      this.#imgRect.x + particle.x / this.#imgToStageRatio.x,
      this.#imgRect.y + particle.y / this.#imgToStageRatio.y
    );
    this.stroke();

    this.setFillStyle(particle.color);
    this.beginPath();
    this.arc(
      this.#imgRect.x + particle.x / this.#imgToStageRatio.x,
      this.#imgRect.y + particle.y / this.#imgToStageRatio.y,
      4,
      0,
      PI2
    );

    this.fill();

    this.restoreCanvas();
  }

  drawMovingImage() {
    this.#drawTitle();
    this.#drawSubTitle();
    this.#drawBackground();

    this.drawImage(
      this.#img,
      0, 0, this.#img.width, this.#img.height,
      this.#imgRect.x, this.#imgRect.y, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    this.#imgRect.y -= this.#movingSpeed;
  }

  #drawTitle() {
    this.saveCanvas();

    this.setFont(this.#titleFont.font);
    this.setFillStyle(ImageGenerator.BG_COLOR);

    const fontPos = this.measureText(ImageGenerator.TITLE);
    this.fillText(
      ImageGenerator.TITLE,
      (this.stageWidth - fontPos.width) / 2,
      (this.stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2
    ); // prettier-ignore

    this.restoreCanvas();
  }

  #drawSubTitle() {
    this.saveCanvas();

    this.setFont(this.#subTitleFont.font);
    this.setFillStyle(ImageGenerator.BG_COLOR);
    this.setTextBaseline('middle');

    const fontPos = this.measureText(ImageGenerator.SUB_TITLE);
    this.fillText(ImageGenerator.SUB_TITLE, (this.stageWidth - fontPos.width) / 2, 50); // prettier-ignore

    this.restoreCanvas();
  }

  #drawBackground() {
    this.saveCanvas();

    this.setFillStyle(ImageGenerator.BG_COLOR);
    this.fillRect(
      this.#imgRect.x - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgRect.y - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgRect.width + ImageGenerator.BG_THICKNESS,
      this.#imgRect.height + ImageGenerator.BG_THICKNESS
    );

    this.restoreCanvas();
  }

  get isDisappeared() {
    return this.#imgRect.y + this.#imgRect.height * 1.5 < 0;
  }
}
