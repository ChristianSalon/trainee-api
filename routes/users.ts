import { Request, Response } from "express";
import { User } from "../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "chris",
  password: "password",
  database: "trainee",
});

router.get("/team/:teamId/:search", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const search = req.params.search;

  connection.query(
    `SELECT * FROM users WHERE name LIKE "%${search}%" 
    AND userId NOT IN 
    (SELECT userId FROM teams_users WHERE teamId = "${teamId}") 
    AND userId NOT IN 
    (SELECT userId FROM requests WHERE teamId = "${teamId}");`,
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
  const user: User = req.body;

  connection.query(
    `INSERT INTO users (userId, name, photoURL, email) values (?, ?, ?, ?)`,
    [user.userId, user.name, user.photoURL, user.email],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("New User Created.");
      }
    }
  );
});

router.put("/editName/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const name: string = req.body.name;

  connection.query(
    `UPDATE users SET name = ? WHERE userId = ?`,
    [name, userId],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("User Name Updated.");
      }
    }
  );
});

module.exports = router;
