"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const admin = __importStar(require("firebase-admin"));
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let StorageService = class StorageService {
    constructor() {
        this.bucket = admin.storage().bucket();
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException("File not uploaded");
        }
        const { originalname } = file;
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = uniqueSuffix + "-" + originalname;
        const blob = this.bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
        });
        return new Promise((resolve, reject) => {
            blobStream.on("error", (error) => {
                reject(error);
            });
            blobStream.on("finish", () => {
                const url = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
                resolve(url);
            });
            blobStream.end(file.buffer);
        });
    }
    async uploadImageFromUrl(imageUrl) {
        if (!imageUrl) {
            throw new common_1.BadRequestException("No image URL provided");
        }
        try {
            const response = await axios_1.default.get(imageUrl, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "binary");
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = `${uniqueSuffix}-${imageUrl.split("/").pop()}`;
            const blob = this.bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: response.headers["content-type"],
            });
            return new Promise((resolve, reject) => {
                blobStream.on("error", (error) => {
                    reject(error);
                });
                blobStream.on("finish", () => {
                    const url = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
                    resolve(url);
                });
                blobStream.end(buffer);
            });
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to download or upload the image");
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map