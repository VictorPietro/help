// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendLoginMailUseCase } from "./SendLoginMailUseCase";

class SendLoginMailController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email } = request.body;

        // injeção de dependência
        const sendLoginMailUseCase = container.resolve(SendLoginMailUseCase);

        await sendLoginMailUseCase.execute(email);

        return response.send();
    }
}

export { SendLoginMailController };
