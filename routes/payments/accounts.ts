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

router.post("/", async (req: Request, res: Response) => {
  const accountInfo: AccountInfo = req.body;

  const account = await stripe.accounts.create({
    country: "SK",
    type: "express",
    email: accountInfo.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_profile: {
      name: accountInfo.businessName,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://192.168.0.105:3000/payments/accountLinks/reauth",
    return_url: "http://192.168.0.105:3000/payments/accountLinks/return",
    type: "account_onboarding",
  });

  connection.query(
    `UPDATE clubs SET accountId = "${account.id}", isAccountSetUp = 1 WHERE clubId = "${accountInfo.clubId}"`,
    [account.id],
    (error) => {
      if (error) {
        res.status(500).send(error);
      }
    }
  );

  res.send(accountLink.url);
});

module.exports = router;
