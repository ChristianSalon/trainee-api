import { Request, Response } from "express";
import { User } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "chris",
  password: "password",
  database: "trainee",
});

router.get("/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  connection.query(
    `SELECT u.*, t.teamId, tu.role FROM teams_users AS tu 
    INNER JOIN teams AS t ON tu.teamId = t.teamId 
    INNER JOIN users AS u ON tu.userId = u.userId 
    WHERE tu.role = "MEMBER"`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.delete("/:teamId/:userId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;

  connection.query(
    `DELETE FROM teams_users WHERE team_id = ? AND userId = ?`,
    [teamId, userId],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("User Deleted.");
      }
    }
  );
});

module.exports = router;
