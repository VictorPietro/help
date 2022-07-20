// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { FetchOAuthLinkUseCase } from "./FetchOAuthLinkUseCase";
class FetchOAuthLinkController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { google, apple } = request.query;
        const type: string = request.query.type as string;

        // injeção de dependência
        const fetchOAuthLinkUseCase = container.resolve(FetchOAuthLinkUseCase);

        const links = await fetchOAuthLinkUseCase.execute({ google, apple, type });

        return response.json(links);
    }
}

export { FetchOAuthLinkController };
