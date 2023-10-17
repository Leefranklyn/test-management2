import "dotenv/config";

import express from "express";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import routers from "./src/routes/index.js";
import { connectDB } from "./src/config/db.js";
import { error404Handler } from "./src/middleware/error_handler.js";

const MongoDBStore = ConnectMongoDBSession(session)
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  databaseName: "testManagement",
  collection: "mySessions",
});
app.use(
  session({
    store: store,
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(cors({ origin: ['https://enfavedu.netlify.app', 'http://localhost:5173']}));

process.env.NODE_ENV === "development" ? app.use(logger("dev")) : null;

connectDB(process.env.MONGO_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routers(app);

app.use(error404Handler);

const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log(
    `server started on [${process.env.NODE_ENV}] mode at port [${port}]`
  );
});
