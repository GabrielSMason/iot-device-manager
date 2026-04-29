import express from "express";
import {
  createDevice,
  listarDevice,
  atualizarDevice,
  deleteDevice,
  updateDeviceValue,
  getDeviceInfo,
} from "../controllers/DeviceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authDevices from "../middlewares/authDevices.js";

const router = express.Router();

router
  .get("/devices", authMiddleware, listarDevice)
  .post("/devices", authMiddleware, createDevice)
  .patch("/devices/:id", authMiddleware, atualizarDevice)
  .delete("/devices/:id", authMiddleware, deleteDevice)
  .post("/devices/value", authDevices, updateDeviceValue)
  .get("/devices/info", authDevices, getDeviceInfo);

export default router;
