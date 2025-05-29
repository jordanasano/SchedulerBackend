"use strict";

/** Routes for users. */

import { Request, Response } from "express";
import jsonschema from "jsonschema";
import reserveSlotScehma from "../schemas/reserveSlot.json";
import { BadRequestError } from "../expressError";
import express from "express";
const router = express.Router();

const now = new Date();
const year = now.getUTCFullYear();
const month = now.getUTCMonth();   
const day = now.getUTCDate();
const noonUtc = new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString();
const twoPmUtc = new Date(Date.UTC(year, month, day, 14, 0, 0)).toISOString();
const threePmUtc = new Date(Date.UTC(year, month, day, 15, 0, 0)).toISOString();
const fivePmUtc = new Date(Date.UTC(year, month, day, 17, 0, 0)).toISOString();
let openSlots = [noonUtc, twoPmUtc, threePmUtc, fivePmUtc];
router.get("/", function (req: Request, res: Response, next: any) {
    return res.status(200).json({openSlots: openSlots});
});

router.post("/reserve", function (req: Request, res: Response, next: any) {
    const validator = jsonschema.validate(
        req.body,
        reserveSlotScehma,
        { required: true }
    );

    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack).join("/n");
        throw new BadRequestError(errs);
    }

    const reserveSlot = req.body.reserveSlot;

    if (openSlots.find(openSlot => openSlot == reserveSlot)) {
        openSlots = openSlots.filter(openSlot => openSlot != reserveSlot);
        return res.status(200).json({ reserved: reserveSlot });
    } else {
        return res.status(401).json({
            notAvailable: reserveSlot,
            availableSlots: openSlots
        });
    }
});

export default router;