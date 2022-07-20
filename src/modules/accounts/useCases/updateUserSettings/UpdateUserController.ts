// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserSettingsUseCase } from "./UpdateUserUseCase";


class UpdateUserSettingsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { username, name, email, password, bio } = request.body;

        const { id } = request.user;

        // injeção de dependência
        const updateUserSettingsUseCase = container.resolve(UpdateUserSettingsUseCase);

        const user = await updateUserSettingsUseCase.execute({ username, name, email, password, user_id: id, bio });

        return response.status(204).json(user);
    }
}

export { UpdateUserSettingsController };
