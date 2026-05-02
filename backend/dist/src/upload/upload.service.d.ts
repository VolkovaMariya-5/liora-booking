import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly config;
    constructor(config: ConfigService);
    uploadImage(fileBuffer: Buffer, folder?: string): Promise<string>;
}
