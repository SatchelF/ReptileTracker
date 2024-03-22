import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import fs from "fs";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUsersController } from "./server/controllers/users_controller";
import { buildSessionsController } from "./server/controllers/sessions_controller";
import { buildHomeController } from "./server/controllers/home_controller";
import { UsersRepository } from "./server/repositories/users_respository";
import { ReptileRepository } from "./server/repositories/reptiles_repository";
import { HusbandryRecordsRepository } from "./server/repositories/husbandryRecords_repository";
import { SchedulesRepository } from "./server/repositories/schedules_repository";
import { FeedingsRepository } from "./server/repositories/feedings_repository";
import { buildReptilesController } from "./server/controllers/reptiles_controller";
import { buildHusbandryRecordsController } from "./server/controllers/husbandryRecords_controller";
import { buildFeedingsController } from "./server/controllers/feedings_controller";
import { buildSchedulesController } from "./server/controllers/schedules_controller";

const db = new PrismaClient();
const usersRepository = UsersRepository.getInstance(db);
const reptileRepository = ReptileRepository.getInstance(db);
const husbandryRecordsRepository = HusbandryRecordsRepository.getInstance(db);
const feedingsRepository = FeedingsRepository.getInstance(db);
const schedulesRepository = SchedulesRepository.getInstance(db);

dotenv.config();

export const DEBUG = process.env.NODE_ENV !== "production";
export const MANIFEST: Record<string, any> = DEBUG
  ? {}
  : JSON.parse(fs.readFileSync("static/.vite/manifest.json").toString());

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

if (!DEBUG) {
  app.use(express.static("static"));
} else {
  app.use((req, res, next) => {
    if (req.url.includes(".")) {
      res.redirect(`${process.env.ASSET_URL}/${req.url}`);
    } else {
      next();
    }
  });
}

app.use("/", buildHomeController());
app.use("/users", buildUsersController(usersRepository));
app.use("/reptiles", buildReptilesController(reptileRepository));
app.use(
  "/husbandry-records",
  buildHusbandryRecordsController(husbandryRecordsRepository, reptileRepository)
);
app.use(
  "/feedings",
  buildFeedingsController(feedingsRepository, reptileRepository)
);
app.use(
  "/schedules",
  buildSchedulesController(schedulesRepository, reptileRepository)
);
app.use("/sessions", buildSessionsController(db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}...`);
});
