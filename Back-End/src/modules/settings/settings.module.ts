import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { ApiPublicSettingsController, SettingsPublicController } from './settings-public.controller';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController, SettingsPublicController, ApiPublicSettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
