interface Payment {
  paymentId: number;
  teams?: string[];
  teamIds?: string;
  name: string;
  details: string;
  amount: number;
  createdAt: string;
  dueDate: string;
}

export default Payment;
