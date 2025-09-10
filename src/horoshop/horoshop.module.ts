import { Module } from '@nestjs/common';
import { HoroshopService } from './horoshop.service';
// import { config } from 'dotenv';
// config();

@Module({
  providers: [HoroshopService],
})
export class HoroshopModule {}
