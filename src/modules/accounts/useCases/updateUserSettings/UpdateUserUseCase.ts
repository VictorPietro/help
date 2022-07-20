import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface IRequest {
    user_id: string;
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    bio?: string;
}

@injectable()
class UpdateUserSettingsUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) { }

    async execute({ user_id, name, email, password, bio, username }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user && !user_id) {
            throw new AppError("Invalid user!");
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        let newPassword = user.password;

        if (password) {
            if (password.length < 8) {
                throw new AppError("Password must be at least 8 characters long!");
            }

            newPassword = await hash(password, 8);

            user.password = newPassword;
        }

        const updatedUser = await this.usersRepository.update({
            user_id,
            username,
            name,
            email,
            password: newPassword,
            bio,
        });

        return updatedUser;
    }
}

export { UpdateUserSettingsUseCase }
