interface Event {
  eventId: string;
  name: string;
  details: string | null;
  attendanceNumber: number;
  location: string;
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
}

export default Event;
