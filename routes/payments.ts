import { Request, Response } from "express";
import { Payment, PaymentInfo } from "../types";

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

router.get("/team/:teamId/user/:userId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;

  connection.query(
    `SELECT p.*, pu.settledAt, c.accountId FROM payments_users AS pu
    INNER JOIN payments AS p ON pu.paymentId = p.paymentId 
    INNER JOIN payments_teams AS pt ON p.paymentId = pt.paymentId 
    INNER JOIN teams AS t ON pt.teamId = t.teamId 
    INNER JOIN clubs AS c ON t.clubId = c.clubId 
    WHERE pt.teamId = "${teamId}" AND pu.userId = "${userId}"
    GROUP BY p.paymentId
    ORDER BY p.dueDate DESC`,
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/", async (req, res) => {
  const paymentInfo: PaymentInfo = req.body;

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: paymentInfo.customerId },
    { apiVersion: "2020-08-27" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: paymentInfo.amount * 100,
    currency: "eur",
    customer: paymentInfo.customerId,
    payment_method_types: ["card"],
    application_fee_amount: 0,
    transfer_data: {
      destination: paymentInfo.accountId,
    },
    metadata: {
      paymentId: paymentInfo.paymentId,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: paymentInfo.customerId,
    publishableKey:
      "pk_test_51KqHnWBPMHj98s1MrdNH42HuT1IVh2Sx9SYOuEN4C3nmJvVPXxjxl5YZ2wsTMjP1p43MK7Q5FL66ePov4RF5XvR600SV0CmyiN",
  });
});

const endpointSecret =
  "whsec_6f29225af218d3934f6c63bc57b4c18bfa5fef6f1a718d4123ae28443e7374de";

router.post(
  "/succeeded",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const event = request.body;
    let paymentIntent;

    switch (event.type) {
      case "payment_intent.payment_failed":
        paymentIntent = event.data.object;
        console.log("Payment failed");
        response.sendStatus(200);
        break;
      case "payment_intent.processing":
        paymentIntent = event.data.object;
        console.log("Payment processing");
        response.sendStatus(200);
        break;
      case "payment_intent.succeeded":
        paymentIntent = event.data.object;
        console.log("Payment succeeded");
        connection.query(
          `UPDATE payments_users AS pu 
          INNER JOIN users AS u ON pu.userId = u.userId
          SET pu.settledAt = ?
          WHERE u.customerId = ? AND pu.paymentId = ?;`,
          [
            new Date().toISOString().split("T")[0],
            paymentIntent.customer,
            paymentIntent.metadata.paymentId,
          ]
        );
        response.send();
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        response.sendStatus(200);
    }
  }
);

module.exports = router;
