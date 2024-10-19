import { StatusCodes} from 'http-status-codes';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';

import userService from '../services/userService.js';

const userController = {
    getAllUser: async(req, res) => {
        try {
            const response = await userService.getAllUser();
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

            if (!checkMail) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email is not valid' });
            }
            if (!password) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password is required' });
            }

            await userService.login(req.body);

            const secret = speakeasy.generateSecret({ length: 20 }); // Tạo secret cho người dùng
            

            const token = speakeasy.totp({
                secret: secret.base32,
                encoding: 'base32'
            });

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Your TOTP Code',
                text: `Your TOTP code is: ${token}`
            };

            await transporter.sendMail(mailOptions);
            res.status(StatusCodes.ACCEPTED).json({ secret: secret.base32, message: 'Check your email for the TOTP code' })
         } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
         }
    },
    verifyTotp: async(req, res) => {
        const { secret, token } = req.body;

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (verified) {
            res.status(StatusCodes.OK).json({ message: 'OTP code is valid' });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'OTP code is not valid!' });
        }
    }
}

export default userController;
