import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CatalogService } from './catalog.service';
import {
  UpsertCakeSizeDto,
  UpsertDoughDto,
  UpsertFillingDto,
  UpsertSweetFlavorDto,
  UpsertSweetTypeDto,
  UpsertToppingDto,
} from './dto/catalog-admin.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('catalog')
  getCatalog() {
    return this.catalogService.getCatalog();
  }

  @Get('api/public/catalog')
  getPublicCatalog() {
    return this.catalogService.getCatalog();
  }

  @Get('admin/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getAdminOptions() {
    return this.catalogService.getAdminOptions();
  }

  @Get('api/admin/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getApiAdminOptions() {
    return this.catalogService.getAdminOptions();
  }

  @Post('admin/options/doughs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createDough(@Body() dto: UpsertDoughDto) {
    return this.catalogService.createDough(dto);
  }

  @Patch('admin/options/doughs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateDough(@Param('id') id: string, @Body() dto: UpsertDoughDto) {
    return this.catalogService.updateDough(id, dto);
  }

  @Delete('admin/options/doughs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteDough(@Param('id') id: string) {
    return this.catalogService.deactivateDough(id);
  }

  @Post('admin/options/fillings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createFilling(@Body() dto: UpsertFillingDto) {
    return this.catalogService.createFilling(dto);
  }

  @Patch('admin/options/fillings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateFilling(@Param('id') id: string, @Body() dto: UpsertFillingDto) {
    return this.catalogService.updateFilling(id, dto);
  }

  @Delete('admin/options/fillings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteFilling(@Param('id') id: string) {
    return this.catalogService.deactivateFilling(id);
  }

  @Post('admin/options/toppings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createTopping(@Body() dto: UpsertToppingDto) {
    return this.catalogService.createTopping(dto);
  }

  @Patch('admin/options/toppings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateTopping(@Param('id') id: string, @Body() dto: UpsertToppingDto) {
    return this.catalogService.updateTopping(id, dto);
  }

  @Delete('admin/options/toppings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteTopping(@Param('id') id: string) {
    return this.catalogService.deactivateTopping(id);
  }

  @Post('admin/options/cake-sizes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createCakeSize(@Body() dto: UpsertCakeSizeDto) {
    return this.catalogService.createCakeSize(dto);
  }

  @Patch('admin/options/cake-sizes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateCakeSize(@Param('id') id: string, @Body() dto: UpsertCakeSizeDto) {
    return this.catalogService.updateCakeSize(id, dto);
  }

  @Delete('admin/options/cake-sizes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteCakeSize(@Param('id') id: string) {
    return this.catalogService.deactivateCakeSize(id);
  }

  @Post('admin/options/sweet-types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createSweetType(@Body() dto: UpsertSweetTypeDto) {
    return this.catalogService.createSweetType(dto);
  }

  @Patch('admin/options/sweet-types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateSweetType(@Param('id') id: string, @Body() dto: UpsertSweetTypeDto) {
    return this.catalogService.updateSweetType(id, dto);
  }

  @Delete('admin/options/sweet-types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteSweetType(@Param('id') id: string) {
    return this.catalogService.deactivateSweetType(id);
  }

  @Post('admin/options/sweet-flavors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  createSweetFlavor(@Body() dto: UpsertSweetFlavorDto) {
    return this.catalogService.createSweetFlavor(dto);
  }

  @Patch('admin/options/sweet-flavors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateSweetFlavor(@Param('id') id: string, @Body() dto: UpsertSweetFlavorDto) {
    return this.catalogService.updateSweetFlavor(id, dto);
  }

  @Delete('admin/options/sweet-flavors/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  deleteSweetFlavor(@Param('id') id: string) {
    return this.catalogService.deactivateSweetFlavor(id);
  }
}
