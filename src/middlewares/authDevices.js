import Device from "../models/Device.js";
import bcrypt from "bcryptjs";

const authDevices = async (req, res, next) => {
  try {
    const credentials = req.method === 'GET' ? req.query : req.body;
    const { deviceId, password } = credentials;

    if (!deviceId || !password) {
      return res.status(400).json({ message: "Device ID and password are required" });
    }

    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, device.devicePwdHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.device = device;
    next();
  } catch (error) {
    res.status(500).json({ message: `Authentication error: ${error.message}` });
  }
};

export default authDevices;