import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { StaffModule } from './staff/staff.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { ManageModule } from './manage/manage.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Глобальные модули
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    // Основные модули приложения
    UsersModule,
    AuthModule,
    BusinessesModule,
    StaffModule,
    ServicesModule,
    BookingsModule,
    ReviewsModule,
    FavoritesModule,
    ProfileModule,
    AdminModule,
    ManageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
