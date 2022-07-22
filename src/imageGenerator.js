import { PI2 } from './utils.js';

export default class ImageGenerator {
  static BG_THICKNESS = 6;
  static BG_HALF_THICKNESS = ImageGenerator.BG_THICKNESS / 2;

  #canvas;
  #ctx;
  #img;
  #imgPos;
  #imgToStageRatio;
  #imgMovingSpeed;
  #stageWidth;
  #stageHeight;

  constructor(img, imgPosInfo, imgMovingSpeed) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#img = img;
    this.#imgPos = {
      x: imgPosInfo.x,
      y: 0,
      width: imgPosInfo.width,
      height: imgPosInfo.width * (this.#img.height / this.#img.width),
    };
    this.#imgMovingSpeed = imgMovingSpeed;
  }

  resize(stageWidth, stageHeight) {
    this.#stageWidth = stageWidth;
    this.#stageHeight = stageHeight;

    this.#canvas.width = stageWidth;
    this.#canvas.height = stageHeight;

    this.#imgPos.y = stageHeight;

    this.#imgToStageRatio = {
      x: stageWidth / this.#imgPos.width,
      y: stageHeight / this.#imgPos.height,
    };
  }

  getImgParticleInfo() {
    this.#ctx.drawImage(
      this.#img,
      0, 0,
      this.#img.width, this.#img.height,
      0, 0,
      this.#imgPos.width, this.#imgPos.height
    ); // prettier-ignore

    const imageData = this.#ctx.getImageData(
      0, 0, this.#imgPos.width, this.#imgPos.height).data; // prettier-ignore

    let particles = [];
    let pixelIndex;

    for (let y = 0; y < this.#imgPos.height; y++) {
      for (let x = 0; x < this.#imgPos.width; x++) {
        pixelIndex = (x + y * this.#imgPos.width) * 4;

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
    this.#ctx.strokeStyle = '#000000';
    this.#ctx.beginPath();

    this.#ctx.moveTo(particle.x, particle.y);
    this.#ctx.lineTo(
      this.#imgPos.x + particle.x / this.#imgToStageRatio.x,
      this.#imgPos.y + particle.y / this.#imgToStageRatio.y
    );
    this.#ctx.stroke();

    this.#ctx.fillStyle = particle.color;
    this.#ctx.beginPath();
    this.#ctx.arc(
      this.#imgPos.x + particle.x / this.#imgToStageRatio.x,
      this.#imgPos.y + particle.y / this.#imgToStageRatio.y,
      4,
      0,
      PI2,
      false
    );

    this.#ctx.fill();
  }

  drawImage = () => {
    this.#ctx.font = '200 40px Hind';
    this.#ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.#ctx.textBaseline = 'middle';

    let text = "Inspired by 'Interactive Developer'";
    let fontPos = this.#ctx.measureText(text);
    this.#ctx.fillText(text, (this.#stageWidth - fontPos.width) / 2, 50);

    this.#ctx.font = '200 300px Hind';
    text = 'GOGH';
    fontPos = this.#ctx.measureText(text);
    this.#ctx.fillText(
      text,
      (this.#stageWidth - fontPos.width) / 2,
      (this.#stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2
    ); // prettier-ignore

    this.#ctx.fillStyle = '#ffffff';
    this.#ctx.fillRect(
      this.#imgPos.x - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgPos.y - ImageGenerator.BG_HALF_THICKNESS,
      this.#imgPos.width + ImageGenerator.BG_THICKNESS,
      this.#imgPos.height + ImageGenerator.BG_THICKNESS
    );

    this.#ctx.drawImage(
      this.#img,
      0, 0,
      this.#img.width, this.#img.height,
      this.#imgPos.x, this.#imgPos.y,
      this.#imgPos.width, this.#imgPos.height
    ); // prettier-ignore

    this.#imgPos.y -= this.#imgMovingSpeed;
    if (this.#imgPos.y + this.#imgPos.height * 2 < 0) {
      return false;
    }
    return true;
  };

  clearStage() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }
}
