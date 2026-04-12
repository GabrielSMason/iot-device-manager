import express from "express";
import { createDevice, listarDevice } from "../controllers/DeviceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .get("/listaDevice", authMiddleware, listarDevice)
  .post("/device", authMiddleware, createDevice);

export default router;
