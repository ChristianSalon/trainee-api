import { Request, Response } from "express";
import { Request as Req } from "../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "chris",
  password: "password",
  database: "trainee",
});

router.get("/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT r.*, t.name AS teamName, t.photoURL AS teamPhotoURL 
    FROM requests AS r 
    INNER JOIN teams AS t ON r.teamId = t.teamId 
    WHERE r.userId = "${userId}"`,
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
  const request: Req = req.body;

  connection.query(
    `INSERT INTO requests (teamId, userId, role, date) VALUES (?, ?, ?, ?)`,
    [request.teamId, request.userId, request.role, request.date],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Request added.");
      }
    }
  );
});

router.post("/acceptRequest/", (req: Request, res: Response) => {
  const request = req.body;

  connection.query(
    `CALL acceptRequest(?, ?, ?, ?)`,
    [request.requestId, request.teamId, request.userId, request.role],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Request accepted.");
      }
    }
  );
});

module.exports = router;
