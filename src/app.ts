"use strict"

import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "./expressError";
import openSlots from "./routes/openSlots";
import express from "express";

const app = express();

//For logging in console
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use("/openSlots", openSlots);

/** Handle 404 errors -- this matches everything */
app.use(function (req: Request, res: Response, next: NextFunction) {
    throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

export default app;