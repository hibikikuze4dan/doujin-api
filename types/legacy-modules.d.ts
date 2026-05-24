declare module "../../constants" {
  export const TEMP_IMAGE_DIRECTORY_PATH: string;
  export const THUMBNAIL_IMAGE_DIRECTORY_PATH: string;
}

declare module "../filesystem" {
  export interface ThumbnailOptions {
    filename?: string;
    height?: number;
    width?: number;
    prefix?: string;
    quality?: number;
  }

  export function createThumbnail(
    imagePath: string,
    outputDir: string,
    options?: ThumbnailOptions,
  ): Promise<string | null>;

  export function extractFirstImage(
    filepath: string,
    outputDir: string,
  ): Promise<string | null>;

  export function deleteFile(filepath: string): Promise<void>;
}
