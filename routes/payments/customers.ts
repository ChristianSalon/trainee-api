import { Request, Response } from "express";
import { CustomerInfo } from "../../types";

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

router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT customerId FROM users WHERE userId = "${userId}" LIMIT 1`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/", async (req: Request, res: Response) => {
  const customerInfo: CustomerInfo = req.body;

  const customer = await stripe.customers.create({
    name: customerInfo.name,
    email: customerInfo.email,
  });

  connection.query(
    `UPDATE users SET customerId = "${customer.id}" WHERE userId = "${customerInfo.userId}"`,
    [customer.id],
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );

  res.send("Customer Created.");
});

module.exports = router;
