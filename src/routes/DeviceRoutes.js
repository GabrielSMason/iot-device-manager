import express from "express";
import {
  createDevice,
  listarDevice,
  atualizarDevice,
} from "../controllers/DeviceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .get("/devices", authMiddleware, listarDevice)
  .post("/devices", authMiddleware, createDevice)
  .patch("/devices/:id", authMiddleware, atualizarDevice);
// .delete("/devices/:id", authMiddleware, deleteDevice);

export default router;
