import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const autorização = req.headers.authorization;
  if (!autorização) {
    return res.status(401).json({ message: "Autorização nao concedida" });
  }
  const tokenExtraido = autorização.split(" ")[1];
  try {
    const payLoad = jwt.verify(tokenExtraido, process.env.JWT_SECRET);
    req.usuarioId = payLoad.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Token inválido ou expirado:${error.message}` });
  }
};

export default authMiddleware;
