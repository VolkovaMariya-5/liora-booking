import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

// UploadService — загрузка изображений в Cloudinary
// Используется для аватаров пользователей и лого бизнеса
@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    // Конфигурируем Cloudinary один раз при инициализации сервиса
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  // Загружает base64-строку или URL в Cloudinary
  // Возвращает публичный URL загруженного изображения
  async uploadImage(fileBuffer: Buffer, folder: string = 'liora'): Promise<string> {
    return new Promise((resolve, reject) => {
      // Используем upload_stream для загрузки из буфера без временных файлов
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' }, // ограничиваем максимальный размер
            { quality: 'auto' },                         // авто-оптимизация качества
            { fetch_format: 'auto' },                    // авто-выбор формата (WebP где поддерживается)
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(new BadRequestException('Ошибка загрузки изображения'));
          } else {
            resolve(result.secure_url);
          }
        },
      );
      uploadStream.end(fileBuffer);
    });
  }
}
