import { AssetService } from './asset.service';
import { Asset } from './asset.entity';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    getAll(): Promise<Asset[]>;
    getOne(id: number): Promise<Asset>;
    create(body: Partial<Asset>): Promise<Asset>;
    update(id: number, body: Partial<Asset>): Promise<Asset>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
