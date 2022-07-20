import { inject, injectable } from "tsyringe";

import { Asset } from "@modules/options/infra/typeorm/entities/Asset";

import { IAssetsRepository } from "@modules/options/repositories/IAssetsRepository";

@injectable()
class ListAssetsUseCase {
    constructor(
        @inject("AssetsRepository")
        private assetsRepository: IAssetsRepository) { }

    async execute(): Promise<Asset[]> {
        const assets = await this.assetsRepository.list();

        return assets;
    }
}

export { ListAssetsUseCase };
