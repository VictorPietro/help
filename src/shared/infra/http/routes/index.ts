import { Router } from 'express';
import boolParse from "express-query-boolean";
import cors from "cors";

import { authenticateRoutes } from './authenticate.routes';

import { usersRoutes } from './users.routes';
import { passwordRoutes } from './password.routes';
import { oauthRoutes } from './oauth.routes';
import { assetsRoutes } from './assets.routes';

const router = Router();

// allow CORS
router.use(cors());

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

router.use(boolParse());

router.use("/users", usersRoutes);
router.use("/password", passwordRoutes);
router.use("/oauth", oauthRoutes);
router.use("/assets", assetsRoutes);

router.use(authenticateRoutes);

export { router };
