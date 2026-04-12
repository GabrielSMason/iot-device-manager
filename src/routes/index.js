import express from "express";
import auth from "./AuthRoutes.js";
import device from "./DeviceRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send("Aplicação IoT ");
  });

  app.use(express.json(), auth, device);
};

export default routes;
