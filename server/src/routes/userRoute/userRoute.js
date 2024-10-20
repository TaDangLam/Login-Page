import express from 'express';
const Router = express.Router();

import userController from '../../controllers/userController.js';
import authMiddleWare from '../../middleware/authMiddleware.js';


Router.get('/get-detail-user/:id', authMiddleWare.verifyCustomer, userController.getDetailUser);
Router.post('/register', userController.register);
Router.post('/login', userController.login);
Router.post('/verify-totp', userController.verifyTotp);
Router.post('/refresh-token', userController.refreshTokenService)

export const UserRoute = Router;
