import DuplicateDraw from './duplicateDraw.js';

export default class AppBuilder {
  imgUrl(imgUrl) {
    this.imgUrl = imgUrl;
    return this;
  }

  build() {
    return new DuplicateDraw(this.imgUrl);
  }
}
