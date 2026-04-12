import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const registrar = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const novoCliente = await User.create({
      email: email,
      fullName: fullName,
      password: passwordHash,
    });
    res
      .status(201)
      .json({ message: "Ciente criado com sucesso", user: novoCliente });
  } catch (erro) {
    res
      .status(500)
      .json({ message: `${erro.message} - Falha ao cadastra o Cliente` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email: email });
    if (!usuario) {
      return res.status(401).json({ message: "Usuario nao encontrado" });
    }
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ message: "Senha incorreta" });
    }
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ message: "Login Sucesso!", token: token });
  } catch (error) {
    res.status(500).json({ message: "Erro na hora de logar." });
  }
};

export default { registrar, login };
