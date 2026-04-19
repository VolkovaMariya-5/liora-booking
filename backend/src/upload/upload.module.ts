import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

// UploadModule — загрузка файлов в Cloudinary
// Использует multer (встроен в @nestjs/platform-express) для обработки multipart/form-data
@Module({
  imports: [
    MulterModule.register({ storage: undefined }), // memoryStorage: файл в buffer, без диска
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // экспортируем для возможного использования в других модулях
})
export class UploadModule {}
