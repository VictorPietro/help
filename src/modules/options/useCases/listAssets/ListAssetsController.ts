import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAssetsUseCase } from "../listAssets/ListAssetsUseCase";

class ListAssetsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listAssetsUseCase = container.resolve(ListAssetsUseCase);

        const all = await listAssetsUseCase.execute();

        return response.json(all);
    }
}

export { ListAssetsController };
