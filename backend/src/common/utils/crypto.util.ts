import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as crypto from "node:crypto";
import * as dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-cbc";
const RANDOM_BYTES = 16;

@Injectable()
export class CryptoUtil {
  constructor(private configService: ConfigService) {}

  public async encrypt(text: string) {
    const CRYPTO_ENCRYPTION =
      this.configService.get<string>("CRYPTO_ENCRYPTION");

    const iv = crypto.randomBytes(RANDOM_BYTES);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(CRYPTO_ENCRYPTION),
      iv,
    );

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  public async decrypt(text: string) {
    const CRYPTO_ENCRYPTION =
      this.configService.get<string>("CRYPTO_ENCRYPTION");
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(CRYPTO_ENCRYPTION),
      iv,
    );

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}
