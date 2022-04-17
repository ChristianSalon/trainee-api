import { Request, Response } from "express";
import { Team } from "../types";
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
    `SELECT t.teamId, t.clubId, t.name, t.photoURL, c.name AS clubName FROM teams_users AS tu 
    INNER JOIN teams AS t ON tu.teamId = t.teamId 
    INNER JOIN users AS u ON tu.userId = u.userId 
    INNER JOIN clubs AS c ON t.clubId = c.clubId 
    WHERE u.userId = "${userId}"`,
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
