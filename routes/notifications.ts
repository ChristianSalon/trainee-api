import { Request, Response } from "express";
import { NotificationToken } from "../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/team/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const userId = req.query.userId;

  connection.query(
    `SELECT nt.token FROM notification_tokens AS nt
    INNER JOIN teams_users AS tu ON nt.userId = tu.userId
    WHERE tu.teamId = ? AND tu.userId != ?;`,
    [teamId, userId],
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
  const notificationToken: NotificationToken = req.body;

  connection.query(
    `INSERT INTO notification_tokens (userId, token) VALUES (?, ?);`,
    [notificationToken.userId, notificationToken.token],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Token registered");
      }
    }
  );
});

module.exports = router;
