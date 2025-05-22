const express = require("express");
const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

const dbconnect = require("./model/dbconnect");
dbconnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("dotenv").config();
app.listen(process.env.port, () => {
  console.log(`server running at http://localhost:${process.env.port}`);
});

const userRouter = require("./router/userRouter");
app.use("/", userRouter);
