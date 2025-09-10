import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { HoroshopModule } from 'src/horoshop/horoshop.module';
import { HoroshopService } from 'src/horoshop/horoshop.service';

@Module({
  imports: [HoroshopModule],
  providers: [UploadService, HoroshopService],
  controllers: [UploadController],
})
export class UploadModule {}
