import { container } from "tsyringe";

import "@shared/container/providers";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

import { IAssetsRepository } from "@modules/options/repositories/IAssetsRepository";
import { AssetsRepository } from "@modules/options/infra/typeorm/repositories/AssetsRepository";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";

// singleton é um padrão que garante a existência de uma única instância
// passa um nome "" e o repositório
container.registerSingleton<IAssetsRepository>(
    "AssetsRepository",
    AssetsRepository
);

container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
);

container.registerSingleton<IUsersTokensRepository>(
    "UsersTokensRepository",
    UsersTokensRepository
);
