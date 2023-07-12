import express from "express";
import { addJob, getAllJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/api/jobs", getAllJobs);
jobRouter.post("/api/job", addJob);

export default jobRouter;
