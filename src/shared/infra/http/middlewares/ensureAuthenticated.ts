import { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";
import auth from "@config/auth";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

interface IDecoded {
    exp?: number;
}

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    const dateProvider = new DayjsDateProvider();

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    // ignorando a posição 0 (Bearer)
    const [, token] = authHeader.split(" ");

    let expired = false;

    try {
        // decodify without checking signature (just to get expiration timestamp)
        const { exp } = decode(token) as IDecoded;

        // get expiration date from token "exp" field and check whether it's still valid
        if (dateProvider.compareIfBefore(dateProvider.convertUnixToDate(exp), dateProvider.dateNow())) {
            expired = true;
        }

        const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

        // para poder fazer isso, precisa sobrescrever a interface do Request, o que é feito em src/@types/express/index.d.ts
        request.user = {
            id: user_id,
        };

        next();
    } catch {
        let codeResponse = (expired) ? "token.expired" : null;

        throw new AppError("Invalid token!", 401, codeResponse);
    }
}

export async function authOptional(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        next();
    } else {
        // ignorando a posição 0 (Bearer)
        const [, token] = authHeader.split(" ");

        try {
            const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

            // para poder fazer isso, precisa sobrescrever a interface do Request, o que é feito em src/@types/express/index.d.ts
            request.user = {
                id: user_id,
            };

            next();
        } catch {
            throw new AppError("Invalid token!", 401, "token.expired");
        }
    }
}
