import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {}

  findAll(): Promise<Asset[]> {
    return this.assetRepo.find({
      order: { asset_id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepo.findOneBy({ asset_id: id });
    if (!asset) {
      throw new NotFoundException(`Asset dengan ID ${id} tidak ditemukan`);
    }
    return asset;
  }

  create(data: Partial<Asset>): Promise<Asset> {
    const newAsset = this.assetRepo.create(data);
    return this.assetRepo.save(newAsset);
  }

  async update(id: number, data: Partial<Asset>): Promise<Asset> {
    await this.findOne(id);
    await this.assetRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.assetRepo.delete(id);
    return { message: `Asset dengan ID ${id} berhasil dihapus` };
  }
}
