import { inject, injectable } from "tsyringe";
import { IAssetsRepository } from "@modules/options/repositories/IAssetsRepository";

@injectable()
class SocketProvider {
    constructor(
        @inject("AssetsRepository")
        private assetsRepository: IAssetsRepository,
    ) { }

    async execute(get_assets = true): Promise<any[]> {
        let subscribedAssets = [];
        let subscribed = [];

        if (get_assets) {
            subscribedAssets = await this.assetsRepository.findSubscribed();

            subscribedAssets.map((asset) => {
                subscribed.push(asset.ticker);
            });
        }

        return subscribed;
    }
}

export { SocketProvider };
