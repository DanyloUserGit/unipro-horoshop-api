import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { HoroshopModule } from './horoshop/horoshop.module';

@Module({
  imports: [UploadModule, HoroshopModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
