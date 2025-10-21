import { ConfigService } from "@nestjs/config";
export declare class CryptoUtil {
    private configService;
    constructor(configService: ConfigService);
    encrypt(text: string): Promise<string>;
    decrypt(text: string): Promise<string>;
}
