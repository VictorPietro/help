import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IGoogleRecaptchaProvider } from "@shared/container/providers/RecaptchaProvider/IRecaptchaProvider";

interface IRequest {
    token: string;
    password: string;
    form_recaptcha: string;
}

@injectable()
class ResetPasswordUserUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("GoogleRecaptchaProvider")
        private googleRecaptchaProvider: IGoogleRecaptchaProvider,
    ) { }

    async execute({ token, password, form_recaptcha }: IRequest): Promise<void> {

        // validate recaptcha
        const recaptchaVerify = await this.googleRecaptchaProvider.verify(form_recaptcha, "invisible");

        if (!recaptchaVerify) {
            throw new AppError("ReCaptcha has failed.");
        }

        const userToken = await this.usersTokensRepository.findByRefreshToken(token);

        if (!userToken) {
            throw new AppError("Token invalid!");
        }

        if (this.dateProvider.compareIfBefore(userToken.expiration_date, this.dateProvider.dateNow())) {
            throw new AppError("Token expired!");
        }

        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters long!");
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        user.password = await hash(password, 8);

        await this.usersRepository.create(user);

        await this.usersTokensRepository.deleteById(userToken.id);
    }
}

export { ResetPasswordUserUseCase }
