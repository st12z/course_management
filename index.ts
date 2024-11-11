import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import { clienRoutes } from "./routes/client/index.route";
import path from "path";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import cors from 'cors';
dotenv.config();
database.connect();
const app: Express = express();
const PORT: number | string = process.env.PORT;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("AB"));
app.use(session({cookie:{maxAge:60000}}));
app.use(flash());
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
clienRoutes(app);
app.listen(PORT, () => {
  console.log(`App listening or port ${PORT}`);
});
