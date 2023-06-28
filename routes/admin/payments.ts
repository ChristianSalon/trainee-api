import { Request, Response } from "express";
import { Payment } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

router.get("/club/:clubId", (req: Request, res: Response) => {
  const clubId = req.params.clubId;

  connection.query(
    `SELECT p.*, GROUP_CONCAT(t.teamId SEPARATOR ', ') AS "teamIds" FROM payments_teams AS pt 
    INNER JOIN payments AS p ON pt.paymentId = p.paymentId 
    INNER JOIN teams AS t ON pt.teamId = t.teamId 
    INNER JOIN clubs AS c ON t.clubId = c.clubId 
    WHERE c.clubId = ? 
    GROUP BY p.paymentId 
    ORDER BY p.dueDate DESC;`,
    [clubId],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
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
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/:paymentId", (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;

  connection.query(
    `SELECT pu.id, u.name, u.photoURL, pu.settledAt FROM payments_users AS pu
    INNER JOIN users AS u ON pu.userId = u.userId
    WHERE pu.paymentId = ?
    GROUP BY u.userId;`,
    [paymentId],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
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
    `CALL createPayment(?, ?, ?, ?, ?, ?);`,
    [
      payment.name,
      payment.details,
      payment.amount,
      payment.createdAt,
      payment.dueDate,
      payment.teamIds,
    ],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("New Payment Created.");
      }
    }
  );
});

router.delete("/:paymentId", (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;

  connection.query(`CALL deletePayment(?)`, [paymentId], (error) => {
    if (error) {
      res.status(500).send(error);
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
        res.status(500).send(error);
      } else {
        res.send("Payment Updated.");
      }
    }
  );
});

module.exports = router;
