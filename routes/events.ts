import axios from "axios";
import { Request, Response } from "express";
import { Event } from "../types";

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
  const date = req.query.date;

  connection.query(
    `SELECT e.*, group_concat(t.teamId) AS "teamIds", GROUP_CONCAT(t.name SEPARATOR ', ') AS "teamsString" 
    FROM events_teams AS et 
    INNER JOIN events AS e ON et.eventId = e.eventId 
    INNER JOIN teams AS t ON et.teamId = t.teamId 
    WHERE e.startDate >= DATE_SUB(?, INTERVAL 2 MONTH)
    AND e.startDate <= DATE_SUB(?, INTERVAL -2 MONTH)
    GROUP BY et.eventId 
    HAVING teamIds LIKE "%${teamId}%"
    ORDER BY e.startDate ASC;`,
    [date, date],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/", (req: Request, res: Response) => {
  const event: Event = req.body;

  connection.query(
    `CALL createEvent(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.eventId,
      event.name,
      event.details,
      event.attendanceNumber,
      event.location,
      event.startTime,
      event.endTime,
      event.startDate,
      event.endDate,
    ],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        event.teams.forEach((teamId) => {
          connection.query(
            `INSERT INTO events_teams (teamId, eventId) VALUES (?, ?);`,
            [teamId, event.eventId],
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
        res.send("New Event Created.");
      }
    }
  );
});

router.delete("/:eventId", (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  connection.query(`CALL deleteEvent(?)`, [eventId], (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send("Event Deleted.");
    }
  });
});

router.put("/:eventId", (req: Request, res: Response) => {
  const event: Event = req.body;

  connection.query(
    `UPDATE events 
    SET name = ?, details = ?, location = ?, startTime = ?, endTime = ?, startDate = ?, endDate = ? 
    WHERE eventId = '${event.eventId}'`,
    [
      event.name,
      event.details,
      event.location,
      event.startTime,
      event.endTime,
      event.startDate,
      event.endDate,
    ],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Event Updated.");
      }
    }
  );
});

module.exports = router;
