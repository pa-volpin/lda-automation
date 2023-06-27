import {  v4 as uuidV4 } from 'uuid';
import { ICombination } from '../types';

interface IProps {
  image: ICombination['image'];
  imageMeasure: ICombination['imageMeasure'];
}

export const processImages = async ({ image, imageMeasure }: IProps) => {
    if (!image || !imageMeasure) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Load image1
    const image1 = new Image();
    image1.src = image.img as string;

    // Load image2
    const image2 = new Image();
    image2.src = imageMeasure.img as string;

    // Wait for both images to load
    await Promise.all([new Promise((resolve) => image1.onload = resolve), new Promise((resolve) => image2.onload = resolve)]);

    // Set the canvas dimensions to 1080px x 1080px
    canvas.width = 1080;
    canvas.height = 1080;

    // Crop image1 by cropPercentage on all sides and resize to 1080px x 1080px
    const cropPercentageImage1 = 0.40;

    const propertiesImage1 = {
      sx: image1.width * cropPercentageImage1,
      sy: image1.height * cropPercentageImage1,
      sw: (1 - 2 * cropPercentageImage1) * image1.width,
      sh: (1 - 2 * cropPercentageImage1) * image1.height,
      dx: 0,
      dy: 0,
      dw: canvas.width,
      dh: canvas.height
    }

    // Draw the cropped and resized image1 onto the canvas
    ctx?.drawImage(image1, propertiesImage1.sx, propertiesImage1.sy, propertiesImage1.sw, propertiesImage1.sh, propertiesImage1.dx, propertiesImage1.dy, propertiesImage1.dw, propertiesImage1.dh);

    // Crop image1 by cropPercentage on all sides and resize to 1080px x 1080px
    const cropPercentageTopImage2 = 0.45;
    const cropPercentageBottomImage2 = 0.28;
    const cropPercentageRightImage2 = 0.40;

    const propertiesImage2 = {
      sx: 0.15 * image2.width,
      sy: image2.height * cropPercentageTopImage2,
      sw: (1 - cropPercentageRightImage2) * image2.width,
      sh: (1 - cropPercentageTopImage2 - cropPercentageBottomImage2) * image2.height,
      dx: canvas.width - (1 - cropPercentageRightImage2) * image2.width,
      dy: canvas.height - (1 - cropPercentageTopImage2 - cropPercentageBottomImage2) * image2.height,
      dw: (1 - cropPercentageRightImage2) * image2.width,
      dh: (1 - cropPercentageTopImage2 - cropPercentageBottomImage2) * image2.height
    }

    // Draw the cropped and resized image2 onto the canvas
    ctx?.drawImage(image2, propertiesImage2.sx, propertiesImage2.sy, propertiesImage2.sw, propertiesImage2.sh, propertiesImage2.dx, propertiesImage2.dy, propertiesImage2.dw, propertiesImage2.dh);

    // Get the final image as a data URL
    const finalImageDataURL = canvas.toDataURL('image/jpeg');

    // Perform further actions with the final image data URL
    return ({ img: finalImageDataURL, id: uuidV4(), createdAt: new Date() });
};