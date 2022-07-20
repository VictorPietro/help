// importa os tipos pois não é um Router (que já sabe quais tipos são)
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CallbackHandlerGoogleUseCase } from "./CallbackHandlerGoogleUseCase";

class CallbackHandlerGoogleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const code: string = request.query.code as string;
        const state: string = request.query.state as string;

        // injeção de dependência
        const callbackHandlerGoogleUseCase = container.resolve(CallbackHandlerGoogleUseCase);

        const token = await callbackHandlerGoogleUseCase.execute(code, state);

        response.redirect(`http://localhost:3000/${state}?token=${token.token}&refresh_token=${token.refresh_token}`);
        return;
        // return response.json(token);
    }
}

export { CallbackHandlerGoogleController };
