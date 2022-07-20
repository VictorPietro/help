// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { FetchUserUseCase } from "./FetchUserUseCase";

class FetchUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        // injeção de dependência
        const fetchUserUseCase = container.resolve(FetchUserUseCase);

        const user = await fetchUserUseCase.execute({ user_id: id });

        return response.json(user);
    }
}

export { FetchUserController };
