import './webpack/dist/duplication.js';

const imgUrl = 'imgs/gogh1.jpg';

window.onload = () => {
  new AppBuilder().imgUrl(imgUrl).build();
};

export default class AppBuilder {
  #app;

  imgUrl(imgUrl) {
    this.imgUrl = imgUrl;
    return this;
  }

  build() {
    const img = new Image();
    img.src = this.imgUrl;
    img.onload = () => {
      this.#app = new DuplicateDraw(img);
      window.requestAnimationFrame(this.animate);
      window.addEventListener('resize', this.resize);
    };

    return this.#app;
  }

  animate = (curTime) => {
    this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };

  resize = () => {
    this.#app.resize();
  };
}
