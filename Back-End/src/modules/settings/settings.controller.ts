import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
