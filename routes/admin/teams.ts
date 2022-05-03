import { Request, Response } from "express";
import { Team } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/club/:clubId/user/:userId", (req: Request, res: Response) => {
  const clubId = req.params.clubId;
  const userId = req.params.userId;

  connection.query(
    `SELECT t.teamId, t.clubId, t.name, t.photoURL FROM teams_users AS tu 
    INNER JOIN teams AS t ON tu.teamId = t.teamId 
    INNER JOIN users AS u ON tu.userId = u.userId 
    WHERE u.userId = ? AND tu.role = ? AND t.clubId = ?;`,
    [userId, "MANAGER", clubId],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const team: Team = req.body;

  connection.query(
    `CALL createTeam(?, ?, ?, ?, ?, ?)`,
    [team.teamId, team.clubId, team.name, team.photoURL, userId, "MANAGER"],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("New Team Created.");
      }
    }
  );
});

router.delete("/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;

  connection.query(`CALL deleteTeam(?)`, [teamId], (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send("Team Deleted.");
    }
  });
});

router.put("/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const team: Team = req.body;

  connection.query(
    `UPDATE teams 
    SET name = '${team.name}', photoURL = '${team.photoURL}' 
    WHERE teamId = '${teamId}'`,
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Team Updated.");
      }
    }
  );
});

module.exports = router;
