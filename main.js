import AppBuilder from './src/appBuilder.js';

const imgUrl = 'imgs/gogh1.jpg';

window.onload = () => {
  new AppBuilder().imgUrl(imgUrl).build();
};
