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
    const ownerDevice = await Device.findById(idDevice).select("owner");
    let deviceAtualizado;

    if (ownerDevice === null) {
      res.status(404).json({ message: "Device não encontrado" });
      return;
    }
    if (ownerDevice.owner.toString() === req.usuarioId) {
      deviceAtualizado = await Device.findByIdAndUpdate(
        idDevice,
        { nickname: req.body.nickname },
        { new: true }, // retorna o documento já atualizado
      );
      if (!deviceAtualizado) {
        res.status(403).json({ message: "Device não encontrado" });
        return;
      }
    } else {
      res.status(404).json({ message: "Usuario não é o dono do Sensor" });
      return;
    }
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
// export const deleteDevice = async (req, res) => {
//   try {
//   } catch (error) {}
// };
