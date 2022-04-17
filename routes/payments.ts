import { Request, Response } from "express";
import { Payment } from "../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "chris",
  password: "password",
  database: "trainee",
});

router.get("/team/:teamId/user/:userId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;

  connection.query(
    `SELECT * FROM payments 
    WHERE teamId = "${teamId}" AND userId = "${userId}"
    ORDER BY dueDate DESC`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

module.exports = router;
