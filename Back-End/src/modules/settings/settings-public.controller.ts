import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsPublicController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }
}
