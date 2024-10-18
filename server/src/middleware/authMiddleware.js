import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleWare = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
                if(err){
                    return res.status(StatusCodes.FORBIDDEN).json("Token is not valid");
                }
                // req.user từ user gửi req lên , user bên phải là của database;
                req.user = user;
                next();
            });
        }else{
            return res.status(StatusCodes.UNAUTHORIZED).json("You are not Authenticated");
        }
    },
    verifyCustomer: (req, res, next) => {
        authMiddleWare.verifyToken(req, res, () => {
            const { payload } = req.user;
            if(payload.role === 'customer' || payload.role === 'admin' || payload.role === 'staff'){
                next();
            }else{
                return res.status(StatusCodes.UNAUTHORIZED).json("Please login to use it");
            }
        })
    },
    verifyTokenStaff: (req, res, next) => {
        authMiddleWare.verifyToken(req, res , () => {
            const { payload } = req.user;                                   // Tham số 3 này khác trên như là kiểm qua thêm 1 điều kiện nữa
            if(payload.role === 'staff' || payload.role == 'admin') {
                next();
            }else{
                return res.status(StatusCodes.UNAUTHORIZED).json("You are not allowed to do it");
            }
        })
    },
    verifyTokenAdmin: (req, res, next) => {
        authMiddleWare.verifyToken(req, res, () => {
            const { payload } = req.user;
            if(payload.role === 'admin'){
                next();
            }else{
                return res.status(StatusCodes.UNAUTHORIZED).json("You are not allowed to do it");
            }
        })
    },
    allowGuestAccess: (req, res, next) => {
        const token = req.headers.token;
    
        // Kiểm tra xem có token không
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
                if(err){
                    return res.status(StatusCodes.FORBIDDEN).json("Token is not valid");
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            // Nếu không có token, cho phép tiếp tục thực thi
            next();
        }
    }
}

export default authMiddleWare;
