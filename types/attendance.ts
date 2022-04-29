interface Attendance {
  id: number;
  userId: string;
  eventId: string;
  isComing: boolean;
  date: string;
  excuseNote: string | null | undefined;
}

export default Attendance;
