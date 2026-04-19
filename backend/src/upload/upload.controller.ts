import {
  Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

// UploadController — загрузка изображений через multipart/form-data
// Принимает файл в поле "file", загружает в Cloudinary, возвращает URL
@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // POST /api/upload/image — загрузка изображения
  // Ограничения: только изображения, максимум 5 МБ
  @Post('image')
  @ApiOperation({ summary: 'Загрузить изображение в Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 МБ
      fileFilter: (_req, file, cb) => {
        // Разрешаем только изображения
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Разрешены только изображения'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }
    const url = await this.uploadService.uploadImage(file.buffer);
    return { url };
  }
}
