const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const toolsRoutes = require("./routes/v1/tools.route");
const errorHandler = require("./middleware/errorHandler");
const dbConnection = require("./utils/dbConnect");

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
// console.log(io, "from socket");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
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
  socket.emit("test event", () => {
    console.log("test event fired!");
  });

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

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
