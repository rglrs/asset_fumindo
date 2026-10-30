import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from './asset.entity';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  getAll(): Promise<Asset[]> {
    return this.assetService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Asset> {
    return this.assetService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Asset>): Promise<Asset> {
    return this.assetService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Asset>,
  ): Promise<Asset> {
    return this.assetService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.delete(id);
  }
}
