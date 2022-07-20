// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAssetUseCase } from "./CreateAssetUseCase";

class CreateAssetController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, ticker, latest_price, is_subscribed } = request.body;

        // injeção de dependência
        const createAssetUseCase = container.resolve(CreateAssetUseCase);

        await createAssetUseCase.execute({ name, ticker, latest_price, is_subscribed });

        return response.status(201).send();
    }
}

export { CreateAssetController };
