import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(token: string): Promise<ITokenResponse> {
        if (!token) {
            throw new AppError("Empty token!");
        }

        // 1. recebeu as informações do token
        const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

        const user_id = sub;

        // 2. verifica se o refresh token existe e é válido
        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!userToken) {
            throw new AppError("Refresh Token does not exist!");
        }


        let refresh_token = null;

        // 3. se existir, verifica se está expirado, e, se sim, remove o anterior do BD
        if (this.dateProvider.compareIfBefore(userToken.expiration_date, this.dateProvider.dateNow())) {
            await this.usersTokensRepository.deleteById(userToken.id);

            // 3a. e gera um novo refresh token
            refresh_token = sign({ email }, auth.secret_refresh_token, {
                subject: user_id,
                expiresIn: auth.expires_in_refresh_token
            });

            const expiration_date = this.dateProvider.addDays(auth.expiration_refresh_token_days);

            await this.usersTokensRepository.create({
                user_id,
                refresh_token,
                expiration_date
            });
        } else {
            // 3b. caso contrário, continua usando o atual
            refresh_token = userToken.refresh_token;
        }

        const newToken = sign({ email }, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token,
        });

        return {
            refresh_token,
            token: newToken
        };
    }
}

export { RefreshTokenUseCase };
