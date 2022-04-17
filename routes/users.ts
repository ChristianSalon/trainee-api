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

router.get("/:search", (req: Request, res: Response) => {
  const search = req.params.search;

  connection.query(
    `SELECT * FROM users WHERE name LIKE "%${search}%"`,
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

module.exports = router;
