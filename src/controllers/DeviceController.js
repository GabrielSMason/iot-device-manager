import Device from "../models/Device.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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
      id: novoDevice._id,
      nickname: nickname,
      deviceId: meuDeviceID,
      unit: unit,
      owner: req.usuarioId,
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
    res.status(200).json({ devices: listaDeSensores });
  } catch (error) {
    res.status(500).json({
      message: `${error.message} - Falha ao encontrar o Sensor`,
    });
  }
};
export const atualizarDevice = async (req, res) => {
  try {
    const idDevice = req.params.id;
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ message: "nickname e obrigatorio" });
    }

    let filtroIdDevice;

    if (mongoose.Types.ObjectId.isValid(idDevice)) {
      filtroIdDevice = {
        $or: [{ _id: idDevice }, { deviceId: idDevice }],
      };
    } else {
      filtroIdDevice = { deviceId: idDevice };
    }

    const ownerDevice = await Device.findOne(filtroIdDevice).select("owner");
    if (!ownerDevice) {
      return res.status(404).json({ message: "Device não encontrado" });
    }

    if (ownerDevice.owner.toString() !== req.usuarioId) {
      return res
        .status(403)
        .json({ message: "Usuario nao e o dono do Sensor" });
    }
    const deviceAtualizado = await Device.findOneAndUpdate(
      filtroIdDevice,
      {
        nickname,
      },
      { new: true },
    );
    res.status(200).json({
      message: "Nickname atualizado com sucesso",
      device: deviceAtualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: `${error.message} - Falha ao atualizar o nickname`,
    });
  }
};
export const deleteDevice = async (req, res) => {
  try {
    const idDevice = req.params.id;
    let filtroIdDevice;

    if (mongoose.Types.ObjectId.isValid(idDevice)) {
      filtroIdDevice = {
        $or: [{ _id: idDevice }, { deviceId: idDevice }],
      };
    } else {
      filtroIdDevice = { deviceId: idDevice };
    }
    const ownerDevice = await Device.findOne(filtroIdDevice).select("owner");
    if (!ownerDevice) {
      return res.status(404).json({ message: "Device nao encontrado" });
    }

    if (ownerDevice.owner.toString() !== req.usuarioId) {
      return res
        .status(403)
        .json({ message: "Usuario nao e o dono do Sensor" });
    }

    const deletedDevice = await Device.findOneAndDelete(filtroIdDevice);

    if (!deletedDevice) {
      return res.status(404).json({ message: "Device não encontrado" });
    } else {
      return res
        .status(200)
        .json({ message: "Device excluido com sucesso", deletedDevice });
    }
  } catch (error) {
    return res.status(500).json({
      message: `${error.message} - Falha ao deletar o Device`,
    });
  }
};
