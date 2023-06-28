import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

router.post("/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId;

  const link = await stripe.accounts.createLoginLink(accountId);

  res.send(link.url);
});

module.exports = router;
