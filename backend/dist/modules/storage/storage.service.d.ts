export declare class StorageService {
    private bucket;
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadImageFromUrl(imageUrl: string): Promise<string>;
}
