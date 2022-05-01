import { Request, Response } from "express";
import { Roles } from "../types";
const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/team/:teamId/user/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;

  connection.query(
    `SELECT role FROM teams_users 
    WHERE userId = "${userId}" AND 
    teamId = "${teamId}"`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        let roles: Roles = {
          isMember: false,
          isCoach: false,
          isManager: false,
        };
        results.forEach((row) => {
          switch (row.role) {
            case "MEMBER":
              roles.isMember = true;
              break;
            case "COACH":
              roles.isCoach = true;
              break;
            case "MANAGER":
              roles.isManager = true;
              break;
            default:
              console.log(row.role);
              break;
          }
        });
        res.send(roles);
      }
    }
  );
});

module.exports = router;
