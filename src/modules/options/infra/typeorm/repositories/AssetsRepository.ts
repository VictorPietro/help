import { ICreateAssetDTO, IAssetsRepository } from '@modules/options/repositories/IAssetsRepository';
import { getRepository, Repository } from 'typeorm';

import { Asset } from '../entities/Asset';

class AssetsRepository implements IAssetsRepository {
    private repository: Repository<Asset>;

    constructor() {
        this.repository = getRepository(Asset);
    }

    async create({ name, ticker, latest_price, is_subscribed }: ICreateAssetDTO): Promise<void> {
        const asset = this.repository.create({
            name,
            ticker,
            latest_price,
            is_subscribed,
        });

        await this.repository.save(asset);
    }

    async list(): Promise<Asset[]> {
        const assets = await this.repository.find();

        return assets;
    }

    async findById(id: string): Promise<Asset> {
        const asset = await this.repository.findOne({ id });

        return asset;
    }

    async findByTicker(ticker: string): Promise<Asset> {
        const asset = await this.repository.findOne({ ticker });
        // const assets = await this.repository.findByIds(ids);

        return asset;
    }

    async findSubscribed(): Promise<Asset[]> {
        const assets = await this.repository.find({
            where: {
                is_subscribed: true,
            }
        });

        return assets;
    }
}

export { AssetsRepository }
