const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");
const toolsRoutes = require("./routes/v1/tools.route");
const viewCount = require("./middleware/veiwCount");
const { default: rateLimit } = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");
// const { connectToServer, getDb } = require("./utils/dbConnect");
const dbConnection = require("./utils/dbConnect");

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// configure CORS for specific domains
// const corsOptions = {
//   origin: "http://localhost:5000/",
// };
// app.use(cors(corsOptions));

// ... other middleware and routes

dbConnection.connectToServer();

// Set up Socket.io event handlers here
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

app.use("/api/v1/tools", toolsRoutes);

app.get("/", (req, res) => {
  // res.send("Hello World");
  res.sendFile(__dirname + "/public/test.html");
});

app.all("*", (req, res) => {
  res.send("NO route found.");
});

app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
