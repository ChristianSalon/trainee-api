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
