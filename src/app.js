"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const expressError_1 = require("./expressError");
const express = require("express");
exports.app = express();
/** Handle 404 errors -- this matches everything */
exports.app.use(function (req, res, next) {
    throw new expressError_1.NotFoundError();
});
/** Generic error handler; anything unhandled goes here. */
exports.app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test")
        console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status },
    });
});
//# sourceMappingURL=app.js.map