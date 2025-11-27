import historic1 from '@assets/stock_images/historic_brick_town__d423dcb3.jpg';
import historic2 from '@assets/stock_images/historic_brick_town__b47fc3a4.jpg';
import historic3 from '@assets/stock_images/historic_brick_town__f0e78fed.jpg';
import interior from '@assets/stock_images/cozy_coffee_shop_int_1520432b.jpg';

import brickRed from '@assets/generated_images/solid_warm_brick_red_texture.png';
import slateGray from '@assets/generated_images/solid_slate_gray_texture.png';
import goldYellow from '@assets/generated_images/solid_golden_yellow_texture.png';
import riverBlue from '@assets/generated_images/solid_river_blue_texture.png';

export const stockImages = [historic1, historic2, historic3, interior];
export const textures = [brickRed, slateGray, goldYellow, riverBlue];

export const getRandomImage = () => {
  const all = [...stockImages, ...textures];
  return all[Math.floor(Math.random() * all.length)];
};
