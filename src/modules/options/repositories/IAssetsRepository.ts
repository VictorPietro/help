import { Asset } from "../infra/typeorm/entities/Asset";
import { ICreateAssetDTO } from "../dtos/ICreateAssetDTO";

interface IAssetsRepository {
    findById(id: string): Promise<Asset>;
    findByTicker(ticker: string): Promise<Asset>;
    findSubscribed(): Promise<Asset[]>;
    list(): Promise<Asset[]>;
    create({ name, ticker, latest_price, is_subscribed }: ICreateAssetDTO): Promise<void>;
}

export { IAssetsRepository, ICreateAssetDTO };
