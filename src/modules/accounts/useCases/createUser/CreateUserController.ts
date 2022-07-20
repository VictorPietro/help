// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { username, name, email, password, bio, google_id } = request.body;

        // injeção de dependência
        const createUserUseCase = container.resolve(CreateUserUseCase);

        await createUserUseCase.execute({ username, name, email, password, bio, google_id });

        return response.status(201).send();
    }
}

export { CreateUserController };
