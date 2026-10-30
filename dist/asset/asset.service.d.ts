import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
export declare class AssetService {
    private readonly assetRepo;
    constructor(assetRepo: Repository<Asset>);
    findAll(): Promise<Asset[]>;
    findOne(id: number): Promise<Asset>;
    create(data: Partial<Asset>): Promise<Asset>;
    update(id: number, data: Partial<Asset>): Promise<Asset>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
