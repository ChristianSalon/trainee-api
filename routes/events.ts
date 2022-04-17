import { Request, Response } from "express";
import { Event } from "../types";

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
    `SELECT e.* FROM events_teams as et 
    INNER JOIN events AS e ON et.eventId = e.eventId 
    INNER JOIN teams AS t ON et.teamId = t.teamId 
    WHERE et.teamId = "${teamId}" 
    ORDER BY e.startDate ASC`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/teams/:clubId", (req: Request, res: Response) => {
  const clubId = req.params.clubId;

  connection.query(
    `SELECT teamId, name FROM teams WHERE clubId = "${clubId}"`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/:teamId", (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const event: Event = req.body;

  connection.query(
    `CALL createEvent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      teamId,
    ],
    (error) => {
      if (error) {
        console.log(error);
      } else {
        res.send("New Event Created.");
      }
    }
  );
});

router.delete("/:eventId", (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  connection.query(`CALL deleteEvent(?)`, [eventId], (error) => {
    if (error) {
      console.log(error);
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
        console.log(error);
      } else {
        res.send("Event Updated.");
      }
    }
  );
});

module.exports = router;
