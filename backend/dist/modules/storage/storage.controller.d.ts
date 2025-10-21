import { StorageService } from "./storage.service";
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    create(image: any): Promise<string>;
}
