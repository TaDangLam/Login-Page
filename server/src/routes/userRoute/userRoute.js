import express from 'express';
const Router = express.Router();

import userController from '../../controllers/userController.js';
// import authMiddleWare from '../middleware/authMiddleware.js'

Router.get('/get-all-user', userController.getAllUser);
Router.post('/register', userController.register);


export const UserRoute = Router;
