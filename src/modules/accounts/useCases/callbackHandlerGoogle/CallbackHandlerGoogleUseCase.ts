import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

import auth from "@config/auth";

import { IGoogleOAuthProvider } from "@shared/container/providers/OAuthProvider/IOAuthProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { hash } from "bcrypt";

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
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
class CallbackHandlerGoogleUseCase {
    constructor(
        @inject("GoogleOAuthProvider")
        private googleOAuthProvider: IGoogleOAuthProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute(code: string, type: string): Promise<IResponse> {

        if (!code) {
            throw new AppError('Google Code is invalid.');
        }

        const googleUser: GoogleUser = await this.googleOAuthProvider.getGoogleUser(code);

        if (!googleUser) {
            throw new AppError('Google User not found.');
        }

        const systemUser = await this.usersRepository.findByOAuthId(googleUser.id, 'google');

        let userDataToken = {
            id: systemUser?.id,
            email: systemUser?.email,
            name: systemUser?.name,
        }

        if (!systemUser) {
            if (type === 'signup') {
                // create user
                const randomPass = Date.now().toString() + googleUser.id;
                const passwordHash = await hash(randomPass, 8);
                // username will be family name + 3 char id
                const createdUser = await this.usersRepository.create({
                    username: googleUser.given_name.replace(/\s/g, '') + '_' + googleUser.id.substring(0, 3),
                    name: googleUser.name,
                    email: googleUser.email,
                    google_id: googleUser.id,
                    password: passwordHash,
                });

                // create systemUser just to use data to create token
                userDataToken = {
                    id: createdUser.id,
                    email: createdUser.email,
                    name: googleUser.given_name,
                }
            } else {
                throw new AppError("User does not have Google oAuth set up!");
            }
        }

        const { expires_in_token, secret_token, secret_refresh_token, expires_in_refresh_token, expiration_refresh_token_days } = auth;

        const token = sign({ email: userDataToken.email }, secret_token, {
            subject: userDataToken.id,
            expiresIn: expires_in_token,
        });

        const refresh_token = sign({ email: userDataToken.email }, secret_refresh_token, {
            subject: userDataToken.id,
            expiresIn: expires_in_refresh_token
        });

        const refresh_token_expiration_date = this.dateProvider.addDays(expiration_refresh_token_days);

        await this.usersTokensRepository.create({
            user_id: userDataToken.id,
            refresh_token,
            expiration_date: refresh_token_expiration_date
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: userDataToken.name,
                email: userDataToken.email
            },
            refresh_token
        }

        return tokenReturn;
    }
}

export { CallbackHandlerGoogleUseCase }
