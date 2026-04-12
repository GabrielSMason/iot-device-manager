import Device from "../models/Device.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const createDevice = async (req, res) => {
  try {
    const { nickname, unit } = req.body;
    const meuDeviceID = crypto.randomUUID();
    const senhaDoDispositivo = Math.random().toString(36).slice(-8);
    const senhaDoDispositivoHash = await bcrypt.hash(senhaDoDispositivo, 10);
    const novoDevice = await Device.create({
      nickname: nickname,
      deviceId: meuDeviceID,
      devicePwdHash: senhaDoDispositivoHash,
      unit: unit,
      owner: req.usuarioId,
    });
    res.status(201).json({
      message:
        "Device criado com sucesso,guarde sua senha porque ela não será mostrada novamente!",
      novoDevice: novoDevice,
      suaSenhaSecreta: senhaDoDispositivo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `${error.message} - Falha ao cadastra o Device` });
  }
};
export const listarDevice = async (req, res) => {
  try {
    const listaDeSensores = await Device.find({ owner: req.usuarioId });
    res.status(200).json({ message: listaDeSensores });
  } catch (error) {
    res.status(500).json({
      message: `${error.message} - Falha ao encontrar o Sensor`,
    });
  }
};
