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
    this.ctx.drawImage(
      this.#img,
      0, 0, this.#img.width, this.#img.height,
      0, 0, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    const imageData = this.ctx.getImageData(0, 0, this.#imgRect.width, this.#imgRect.height).data; // prettier-ignore

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
    this.ctx.save();

    this.ctx.strokeStyle = ImageGenerator.LINE_COLOR;
    this.ctx.beginPath();

    this.ctx.moveTo(particle.x, particle.y);
    this.ctx.lineTo(
      this.#imgRect.x + particle.x / this.#imgToStageRatio.x,
      this.#imgRect.y + particle.y / this.#imgToStageRatio.y
    );
    this.ctx.stroke();

    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(
      this.#imgRect.x + particle.x / this.#imgToStageRatio.x,
      this.#imgRect.y + particle.y / this.#imgToStageRatio.y,
      4,
      0,
      PI2
    );

    this.ctx.fill();

    this.ctx.restore();
  }

  drawImage = () => {
    this.#drawTitle();
    this.#drawSubTitle();
    this.#drawBackground();

    this.ctx.drawImage(
      this.#img,
      0, 0, this.#img.width, this.#img.height,
      this.#imgRect.x, this.#imgRect.y, this.#imgRect.width, this.#imgRect.height
    ); // prettier-ignore

    this.#imgRect.y -= this.#movingSpeed;
  };

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
    return this.#imgRect.y + this.#imgRect.height * 1.5 < 0;
  }
}
