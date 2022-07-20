import { inject, injectable } from "tsyringe";

import { IFetchUserDTO } from "@modules/accounts/dtos/IFetchUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { AppError } from "@shared/errors/AppError";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@injectable()
class FetchUserUseCase {
    constructor(
        // sempre que houver esse inject ele lê qual repository quer, vai até o /shared/container, identifica o nome e pega o singleton desse repositório
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) { }

    async execute({ user_id }: IFetchUserDTO): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User not found!");
        }

        delete user.password;
        delete user.isAdmin;

        return user;
    }
}

export { FetchUserUseCase }
