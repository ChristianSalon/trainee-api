import { Request, Response } from "express";
import { Attendance } from "../types";

const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "salonc",
  password: "password",
  database: "trainee",
});

router.get("/:eventId", (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  connection.query(
    `SELECT a.*, u.name, u.photoURL FROM attendance as a 
    INNER JOIN users AS u ON a.userId = u.userId 
    WHERE a.eventId = "${eventId}"
    ORDER BY a.date DESC;`,
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/myAttendance/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;

  connection.query(
    `SELECT * FROM attendance 
    WHERE userId = "${userId}"`,
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
  const attendance: Attendance = req.body;

  connection.query(
    `INSERT INTO attendance (userId, eventId, isComing, date, excuseNote) VALUES (?, ?, ?, ?, ?)`,
    [
      attendance.userId,
      attendance.eventId,
      attendance.isComing,
      attendance.date,
      attendance.excuseNote,
    ],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("New Attendance Created.");
      }
    }
  );
});

router.delete("/:attendanceId", (req: Request, res: Response) => {
  const attendanceId = req.params.attendanceId;

  connection.query(
    `DELETE FROM attendance WHERE attendanceId = ${attendanceId}`,
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Attendance Deleted.");
      }
    }
  );
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const isComing: boolean = req.body.isComing;
  const date: string = req.body.date;
  const excuseNote: string = req.body.excuseNote;

  connection.query(
    `UPDATE attendance 
    SET isComing = ?, date = ?, excuseNote = ? 
    WHERE id = ?;`,
    [isComing, date, excuseNote, id],
    (error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Attendance Updated.");
      }
    }
  );
});

module.exports = router;
