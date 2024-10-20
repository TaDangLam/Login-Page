import { StatusCodes} from 'http-status-codes';

import userService from '../services/userService.js';

const userController = {
    getDetailUser: async(req, res) => {
        try {
            const response = await userService.getDetailUser(req.params);
            res.status(StatusCodes.OK).json(response);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    },
    register: async(req, res) => {
        try {
           const { fullname, email, password, confirmPassword, phone } = req.body;
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            const checkMail = regex.test(email);
            if (!fullname) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Fullname is required' });
            } else if (!email) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is required' });
            } else if (!password) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password is required' });
            } else if (!confirmPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Confirm password is required' });
            } else if (!phone) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Phone number is required' });
            } else if (!checkMail) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is not valid' });
            } else if (password !== confirmPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password and confirm password do not match' });
            }
            
            const response = await userService.register(req.body);
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    },
    login: async(req, res) => {
        try {
            const { email, password } = req.body;
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            const checkMail = regex.test(email);
            if(!checkMail) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is not valid' });
            }
            if(!password) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password is required' });
            }
            const response = await userService.login(req.body);
            res.status(StatusCodes.ACCEPTED).json(response);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    },
    verifyTotp: async(req, res) => {
        try {
            const response = await userService.verifyTotp(req.body);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
        }
    },
    refreshTokenService: async(req, res) => {
        try {
            const { token } = req.body;
            if(!token) {
                return res.status(StatusCodes.FORBIDDEN).json('Token is required');
            }
            const response = await userService.refreshTokenService(req.body);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
        }
    }
}

export default userController;
