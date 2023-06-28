import { Request, Response } from "express";
import { AccountInfo } from "../../types";

const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

router.get("/reauth", (req: Request, res: Response) => {
  console.log("reauth");
});

router.get("/return", (req: Request, res: Response) => {
  console.log("return");
});

router.get("/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId;

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "http://192.168.0.105:3000/payments/accountLinks/reauth",
    return_url: "http://192.168.0.105:3000/payments/accountLinks/return",
    type: "account_onboarding",
  });

  res.send(accountLink.url);
});

module.exports = router;
