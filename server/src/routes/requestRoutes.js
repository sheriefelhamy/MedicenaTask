import { Router } from "express";
import {
  addRequestNote,
  createRequest,
  escalateRequest,
  getRequestById,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";

const router = Router();

router.get("/", getRequests);
router.post("/", createRequest);
router.get("/:id", getRequestById);
router.patch("/:id/status", updateRequestStatus);
router.patch("/:id/escalate", escalateRequest);
router.post("/:id/notes", addRequestNote);

export default router;
