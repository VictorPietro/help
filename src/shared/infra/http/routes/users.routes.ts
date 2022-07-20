import { Router } from 'express';
import multer from 'multer';

import uploadConfig from "@config/upload";

import { FetchUserController } from '@modules/accounts/useCases/fetchUser/FetchUserController';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { UpdateUserSettingsController } from '@modules/accounts/useCases/updateUserSettings/UpdateUserController';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig.upload("./tmp/users/avatar"));

const fetchUserController = new FetchUserController();
const createUserController = new CreateUserController();
const updateUserSettingsController = new UpdateUserSettingsController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.get('/me', ensureAuthenticated, fetchUserController.handle);

usersRoutes.post("/", createUserController.handle);

usersRoutes.patch(
    "/avatar",
    ensureAuthenticated,
    uploadAvatar.single("avatar"),
    updateUserAvatarController.handle
);

usersRoutes.patch(
    "/settings",
    ensureAuthenticated,
    updateUserSettingsController.handle
);

export { usersRoutes };
