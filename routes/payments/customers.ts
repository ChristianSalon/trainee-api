import { Request, Response } from "express";
import { CustomerInfo } from "../../types";

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

router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT customerId FROM users WHERE userId = "${userId}" LIMIT 1`,
    (error, results) => {
      if (error) {
        res.status(500).send(error);
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
        res.status(500).send(error);
      }
    }
  );

  res.send("Customer Created.");
});

module.exports = router;
