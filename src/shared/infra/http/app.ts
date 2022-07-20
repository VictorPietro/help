import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";

import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        const responseCode = (err.responseCode != null) ? { responseCode: err.responseCode } : {};
        return response.status(err.statusCode).json({
            message: err.message,
            ...responseCode,
        });
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`,
    });
});

// serve public static
var publicDir = require('path').join(__dirname, '..', '..', '..', '..', '/tmp');
console.log(publicDir)
app.use(express.static(publicDir));

export { app };
