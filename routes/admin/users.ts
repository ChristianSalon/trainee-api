import { Request, Response } from "express";
import { User } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  connection.query(
    `SELECT u.*, t.teamId, tu.role FROM teams_users AS tu 
    INNER JOIN teams AS t ON tu.teamId = t.teamId 
    INNER JOIN users AS u ON tu.userId = u.userId 
    WHERE t.teamId = "${teamId}";`,
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.put("/editRole/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const role = req.body.role;

  connection.query(
    `UPDATE teams_users SET role = ? WHERE userId = ?;`,
    [role, userId],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Role Updated.");
      }
    }
  );
});

router.delete("/:teamId/:userId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;

  connection.query(
    `DELETE FROM teams_users WHERE teamId = ? AND userId = ?`,
    [teamId, userId],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("User Deleted.");
      }
    }
  );
});

module.exports = router;
