import { Request, Response } from "express";
import { NotificationToken } from "../types";
const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
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

router.post("/user", (req: Request, res: Response) => {
  const body: {
    userId: string;
    title: string;
    body: string;
  } = req.body;
  let tokens;

  connection.query(
    `SELECT token FROM notification_tokens
    WHERE userId = ?;`,
    [body.userId],
    async (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        tokens = results.map((result) => result.token);
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          {
            to: tokens,
            title: body.title,
            body: body.body,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          res.send("Notification sent");
        } else {
          res.status(500).send("Notification failed to send");
        }
      }
    }
  );
});

router.post("/teams", (req: Request, res: Response) => {
  const body: {
    teamIds: string[];
    userId: string;
    title: string;
    body: string;
  } = req.body;
  let tokens;

  connection.query(
    `SELECT nt.token FROM notification_tokens AS nt
    INNER JOIN teams_users AS tu ON nt.userId = tu.userId
    WHERE tu.teamId IN (?) AND tu.userId != ?
    GROUP BY nt.token;`,
    [body.teamIds, body.userId],
    async (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        tokens = results.map((result) => result.token);
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          {
            to: tokens,
            title: body.title,
            body: body.body,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          res.send("Notifications sent");
        } else {
          res.status(500).send("Notifications failed to send");
        }
      }
    }
  );
});

router.post("/clubs", (req: Request, res: Response) => {
  const body: {
    clubId: string;
    userId: string;
    title: string;
    body: string;
  } = req.body;
  let tokens;

  connection.query(
    `SELECT nt.token FROM notification_tokens AS nt
    INNER JOIN teams_users AS tu ON nt.userId = tu.userId
    INNER JOIN teams AS t ON tu.teamId = t.teamId
    INNER JOIN clubs AS c ON c.clubId = t.clubId
    WHERE c.clubId = ? AND nt.userId != ?
    GROUP BY nt.token;`,
    [body.clubId, body.userId],
    async (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        tokens = results.map((result) => result.token);
        const response = await axios.post(
          "https://exp.host/--/api/v2/push/send",
          {
            to: tokens,
            title: body.title,
            body: body.body,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          res.send("Notifications sent");
        } else {
          res.status(500).send("Notifications failed to send");
        }
      }
    }
  );
});

router.delete("/user/:userId/token/:token", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const token = req.params.token;

  connection.query(
    `DELETE FROM notification_tokens WHERE userId = ? AND token = ?;`,
    [userId, token],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Notification token deleted.");
      }
    }
  );
});

module.exports = router;
