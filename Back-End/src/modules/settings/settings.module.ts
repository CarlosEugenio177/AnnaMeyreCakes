import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsPublicController } from './settings-public.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController, SettingsPublicController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
