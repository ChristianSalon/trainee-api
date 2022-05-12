const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const adminClubsRoute = require("./routes/admin/clubs");
const adminTeamsRoute = require("./routes/admin/teams");
const adminEventsRoute = require("./routes/admin/events");
const adminUsersRoute = require("./routes/admin/users");
const adminPaymentsRoute = require("./routes/admin/payments");

const teamsRoute = require("./routes/teams");
const eventsRoute = require("./routes/events");
const attendanceRoute = require("./routes/attendance");
const usersRoute = require("./routes/users");
const requestsRoute = require("./routes/requests");
const rolesRoute = require("./routes/roles");
const paymentsRoute = require("./routes/payments");
const notificationsRoute = require("./routes/notifications");

const paymentsAccountsRoute = require("./routes/payments/accounts");
const paymentsAccountLinksRoute = require("./routes/payments/accountLinks");
const paymentsCustomersRoute = require("./routes/payments/customers");
const paymentsDashboardRoute = require("./routes/payments/dashboard");

app.use("/admin/clubs", adminClubsRoute);
app.use("/admin/teams", adminTeamsRoute);
app.use("/admin/events", adminEventsRoute);
app.use("/admin/users", adminUsersRoute);
app.use("/admin/payments", adminPaymentsRoute);

app.use("/teams", teamsRoute);
app.use("/events", eventsRoute);
app.use("/attendance", attendanceRoute);
app.use("/users", usersRoute);
app.use("/requests", requestsRoute);
app.use("/roles", rolesRoute);
app.use("/payments", paymentsRoute);
app.use("/notifications", notificationsRoute);

app.use("/payments/accounts", paymentsAccountsRoute);
app.use("/payments/accountLinks", paymentsAccountLinksRoute);
app.use("/payments/customers", paymentsCustomersRoute);
app.use("/payments/dashboard", paymentsDashboardRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
