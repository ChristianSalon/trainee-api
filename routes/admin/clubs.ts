import { Request, Response } from "express";
import { Club } from "../../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT c.* FROM clubs_users AS cu 
    INNER JOIN clubs AS c ON cu.clubId = c.clubId 
    INNER JOIN users AS u ON cu.userId = u.userId 
    WHERE u.userId = "${userId}" AND cu.role = "MANAGER"`,
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
  const club: Club = req.body;

  connection.query(
    `CALL createClub(?, ?, ?, ?, ?)`,
    [club.clubId, club.name, club.photoURL, userId, "MANAGER"],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("New Club Created.");
      }
    }
  );
});

router.delete("/:clubId", (req: Request, res: Response) => {
  const clubId = req.params.clubId;

  connection.query(`CALL deleteClub(?)`, [clubId], (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send("Club Deleted.");
    }
  });
});

router.put("/:clubId", (req: Request, res: Response) => {
  const clubId = req.params.clubId;
  const club: Club = req.body;

  connection.query(
    `UPDATE clubs 
    SET name = ?, photoURL = ?
    WHERE clubId = ?`,
    [club.name, club.photoURL, clubId],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Club Updated.");
      }
    }
  );
});

module.exports = router;
