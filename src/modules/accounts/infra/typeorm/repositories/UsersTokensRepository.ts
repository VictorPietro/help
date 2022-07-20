import { getRepository, Repository } from 'typeorm';

import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';

import { UserTokens } from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserTokens>;

    constructor() {
        this.repository = getRepository(UserTokens);
    }

    async create({ expiration_date, refresh_token, user_id }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = this.repository.create({
            expiration_date,
            refresh_token,
            user_id,
        });

        await this.repository.save(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
        const usersToken = await this.repository.findOne({
            user_id,
            refresh_token
        });

        return usersToken;
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = await this.repository.findOne({
            refresh_token
        });

        return userToken;
    }
}

export { UsersTokensRepository }
