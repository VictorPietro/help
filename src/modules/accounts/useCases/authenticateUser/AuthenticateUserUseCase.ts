import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
interface IRequest {
    email: string;
    password: string;
    loginToken?: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    },
    token: string;
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute({ email, password, loginToken }: IRequest): Promise<IResponse> {
        let user = null;
        const { expires_in_token, secret_token, secret_refresh_token, expires_in_refresh_token, expiration_refresh_token_days } = auth;

        if ((email?.length > 0) && (password?.length > 0)) {
            user = await this.usersRepository.findByEmail(email);

            if (!user) {
                throw new AppError("Email or password incorrect!");
            }

            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) {
                throw new AppError("Email or password incorrect!");
            }
        } else {
            const userToken = await this.usersTokensRepository.findByRefreshToken(loginToken);

            if (!userToken) {
                throw new AppError("Token invalid!");
            }

            user = await this.usersRepository.findById(userToken.user_id);

            if (!user) {
                throw new AppError("Token invalid!");
            }

            if (this.dateProvider.compareIfBefore(userToken.expiration_date, this.dateProvider.dateNow())) {
                throw new AppError("Token expired!");
            }

            await this.usersTokensRepository.deleteById(userToken.id);
        }

        const token = sign({ email: user.email }, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token,
        });

        const refresh_token = sign({ email: user.email }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token
        });

        const refresh_token_expiration_date = this.dateProvider.addDays(expiration_refresh_token_days);

        await this.usersTokensRepository.create({
            user_id: user.id,
            refresh_token,
            expiration_date: refresh_token_expiration_date
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email
            },
            refresh_token
        }

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
