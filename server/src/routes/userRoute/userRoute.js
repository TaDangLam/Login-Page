import express from 'express';
const Router = express.Router();

import userController from '../../controllers/userController.js';
import authMiddleWare from '../../middleware/authMiddleware.js';


Router.get('/get-all-user', authMiddleWare.verifyTokenAdmin, userController.getAllUser);
Router.post('/register', userController.register);
Router.post('/login', userController.login);


export const UserRoute = Router;
