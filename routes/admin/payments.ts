import { Request, Response } from "express";
import { Payment } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "chris",
  password: "password",
  database: "trainee",
});

router.get("/team/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  connection.query(
    `SELECT p.*, pt.teamId FROM payments_teams AS pt 
    INNER JOIN payments AS p ON pt.paymentId = p.paymentId 
    WHERE pt.teamId = '${teamId}' 
    ORDER BY p.dueDate DESC`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/teams/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT t.teamId, t.name FROM teams_users AS tu 
    INNER JOIN teams AS t ON tu.teamId = t.teamId 
    INNER JOIN users AS u ON tu.userId = u.userId 
    WHERE u.userId = "${userId}" AND tu.role = "MANAGER"`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/", (req: Request, res: Response) => {
  const payment: Payment = req.body;
  let paymentId;

  connection.query(
    `INSERT INTO payments (name, details, amount, createdAt, dueDate) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      payment.name,
      payment.details,
      payment.amount,
      payment.createdAt,
      payment.dueDate,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        paymentId = result.insertId;
        res.send("New Payment Created.");

        payment.teams.forEach((teamId) => {
          connection.query(
            `INSERT INTO payments_teams (paymentId, teamId) VALUES (?, ?)`,
            [paymentId, teamId],
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
      }
    }
  );
});

router.delete("/:paymentId", (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;

  connection.query(`CALL deletePayment(?)`, [paymentId], (error) => {
    if (error) {
      console.log(error);
    } else {
      res.send("Payment Deleted.");
    }
  });
});

router.put("/:paymentId", (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;
  const payment: Payment = req.body;

  connection.query(
    `UPDATE payments 
    SET name = ?, details = ?, amount = ?, dueDate = ?
    WHERE paymentId = ${paymentId}`,
    [payment.name, payment.details, payment.amount, payment.dueDate],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Payment Updated.");
      }
    }
  );
});

module.exports = router;
