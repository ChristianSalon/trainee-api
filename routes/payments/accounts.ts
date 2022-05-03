import { Request, Response } from "express";
import { AccountInfo } from "../../types";

const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

const stripe = require("stripe")(
  "sk_test_51KqHnWBPMHj98s1MnAX7sZJ6CfY8VvroBEd1MwCD3yGCdUcvFT4IGq3sBP8TT7iXPI41LXO00AvkuBENuyFbaJQe00V74iJtSk"
);

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
    `UPDATE clubs SET accountId = "${account.id}" WHERE clubId = "${accountInfo.clubId}"`,
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
