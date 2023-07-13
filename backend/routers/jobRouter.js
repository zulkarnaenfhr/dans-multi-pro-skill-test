import express from "express";
import { addJob, detailJob, getAllJobs } from "../controllers/jobController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const jobRouter = express.Router();

jobRouter.get("/api/jobs", verifyToken, getAllJobs);
jobRouter.get("/api/jobs/:id", detailJob);
jobRouter.post("/api/job", addJob);

export default jobRouter;
