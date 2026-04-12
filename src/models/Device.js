import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  nickname: { type: String },
  deviceId: { type: String, required: true },
  devicePwdHash: { type: String, required: true },
  unit: { type: String },
  value: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
});

const Device = mongoose.model("devices", DeviceSchema);

export default Device;
