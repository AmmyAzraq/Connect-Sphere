import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { deleteAccount } from "../controllers/delete.controller.js"

const deleteRouter = express.Router()

deleteRouter.delete("/deleteAccount", isAuth, deleteAccount)

export default deleteRouter