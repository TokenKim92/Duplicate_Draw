import './webpack/dist/duplication.min.js';

window.onload = () => {
  const imgUrls = ['./imgs/gogh1.jpg', './imgs/gogh2.jpg', './imgs/gogh3.jpg'];

  new AppBuilder().imgUrl(imgUrls).build();
};

class AppBuilder {
  #app;
  #imageUrls = [];

  imgUrl(imageUrls) {
    this.#imageUrls = imageUrls;
    return this;
  }

  build() {
    this.#app = new DuplicateDraw(this.#imageUrls);
    window.requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize);

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
