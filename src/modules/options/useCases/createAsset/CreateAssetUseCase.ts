import { inject, injectable } from "tsyringe";

import { IAssetsRepository, ICreateAssetDTO } from "@modules/options/repositories/IAssetsRepository";

import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateAssetUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("AssetsRepository")
        private assetsRepository: IAssetsRepository
    ) { }

    async execute({ ticker, name, latest_price, is_subscribed }: ICreateAssetDTO): Promise<void> {

        const assetAlreadyExists = await this.assetsRepository.findByTicker(ticker);

        if (assetAlreadyExists) {
            throw new AppError("Asset already exists!");
        }

        await this.assetsRepository.create({ name, ticker, latest_price, is_subscribed });
    }
}

export { CreateAssetUseCase }
