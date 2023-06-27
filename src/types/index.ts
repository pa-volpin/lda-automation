export interface IImageToCombine {
  id: string;
  img: string | ArrayBuffer | null;
  createdAt: Date;
}

export interface ICombination {
  id: string;
  sku: string;
  image: IImageToCombine | null;
  imageMeasure: IImageToCombine | null;
  resultImage: IImageToCombine | null;
  uploadInProgress: boolean;
  uploadProgress: number;
  uploadStatus: string;
  error: string;
  bucketUrl: string;
}