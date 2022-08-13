import './webpack/dist/duplication.js';

window.onload = () => {
  const imgUrls = ['./imgs/gogh1.jpg', './imgs/gogh2.jpg', './imgs/gogh3.jpg'];

  new AppBuilder().imgUrl(imgUrls).build();
};

class AppBuilder {
  #app;
  #imageList = [];
  #imageUrls = [];
  #imageCount = 0;

  imgUrl(imageUrls) {
    this.#imageUrls = imageUrls;
    return this;
  }

  build() {
    this.#imageUrls.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        this.#imageList.push(img);
        this.#imageCount++;
        this.#isLoadAllImage && this.#onLoadAllImage();
      };
    });

    return this.#app;
  }

  animate = (curTime) => {
    this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };

  resize = () => {
    this.#app.resize();
  };

  get #isLoadAllImage() {
    return this.#imageCount === this.#imageUrls.length;
  }

  #onLoadAllImage() {
    this.#app = new DuplicateDraw(this.#imageList);
    window.requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize);
  }
}
