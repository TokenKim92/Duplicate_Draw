import DuplicateDraw from './duplicateDraw.js';

export default class AppBuilder {
  #app;

  imgUrl(imgUrl) {
    this.imgUrl = imgUrl;
    return this;
  }

  build() {
    this.#app = new DuplicateDraw(this.imgUrl);
    window.requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize);

    return this.#app;
  }

  animate = (curTime) => {
    this.#app.isImgLoaded && this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };

  resize = () => {
    this.#app.isImgLoaded && this.#app.resize();
  };
}
