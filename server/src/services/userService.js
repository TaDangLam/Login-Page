import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';

import prisma from '../libs/prisma.js';
import jwtMiddlewareToken from '../middleware/jwtMiddleware.js';

const userService = {
    getDetailUser: async(data) => {
        try {
            const { id } = data;
            const user = await prisma.user.findUnique({ where: { id }});
            return {
                status: 'OK',
                message: 'Get detail user is success',
                data: user
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
    register: async(data) => { 
        try {
            const { fullname, email, password, confirmPassword, phone } = data;
            
            const checkUser = await prisma.user.findUnique({ where: { email } });
            
            if (checkUser) {
                throw new Error('This user is exist');
            }
            
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const hashed = bcrypt.hashSync(password, 10)
            
            const newUser = await prisma.user.create({ 
                data: {
                    fullname,
                    email,
                    password: hashed,
                    confirmPassword: hashed,
                    phone
                }
            })
            
            return {
                status: "OK",
                message: "CREATED",
                data: newUser
            };
        } catch (error) {
            throw new Error(error.message);
        }
    },
    login: async(user) => {
        const { email, password } = user;
            try {
                const checkUser = await prisma.user.findUnique({ where: { email }});
                if(checkUser === null) {
                    throw new Error('User is not exist');
                }
                
                const comparePassword = bcrypt.compareSync(password, checkUser.password);

                if(!comparePassword){
                    throw new Error('Password is not incorrect');
                }
                
                let secret = checkUser.secret;
                if(!secret) {
                    const newSecret = speakeasy.generateSecret({ length: 20 });
                    secret = newSecret.base32;
                    await prisma.user.update({
                        where: { id: checkUser.id },
                        data: { secret } 
                    })
                }

                const token = speakeasy.totp({
                    secret,
                    encoding: 'base32'
                });

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                const mailOption = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Your OTP code",
                    text: `Your OTP code is: ${token}`
                }

                await transporter.sendMail(mailOption);
                return {
                    status: "Pending OTP",
                    massage: "Check your email for the OTP code",
                    secret,
                    userId: checkUser.id
                }
            } catch (error) {
                throw new Error(error.message);
            }
    },
    verifyTotp: async(data) => {
        const { secret, token, userId } = data;      
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2
        });
        // console.log(verified)
        
        if(verified) {
            const checkUser = await prisma.user.findUnique({ where: { id: userId }});

            if(!checkUser) {
                throw new Error('User is not found');
            }

            const accessToken = await jwtMiddlewareToken.genneralAccessToken({
                id: checkUser.id,
                role: checkUser.role
            })

            const currentTime = new Date();
            let refreshToken;
            let updatedUser;

            // Case 1: longToken is not exist
            if(!checkUser.longToken) {
                refreshToken = await jwtMiddlewareToken.genneralRefreshToken({
                    id: checkUser.id,
                    role: checkUser.role
                });

                updatedUser = await prisma.user.update({
                    where: { id: checkUser.id },
                    data: {
                        longToken: refreshToken,
                        longTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        lastLogin: new Date()
                    }
                });
            } else {
                // Case 2: longToken is exist and longTokenExpiresAt is expired
                if(checkUser.longTokenExpiresAt >= currentTime) {
                    refreshToken = checkUser.longToken;
                    updatedUser = checkUser;
                } else {
                    // Case 3: longToken is exist and longTokenExpiresAt is NOT expired
                    refreshToken = await jwtMiddlewareToken.genneralRefreshToken({
                        id: checkUser.id,
                        role: checkUser.role
                    });

                    updatedUser = await prisma.user.update({
                        where: { id: checkUser.id },
                        data: {
                            longToken: refreshToken,
                            longTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            lastLogin: new Date()
                        }
                    });
                }
            }

            const userWithoutPassword = {
                ...updatedUser,
                password: undefined,
                role: undefined,
                confirmPassword: undefined,
            };

            return {
                status: 'OK',
                message: 'OTP code is valid',
                data: userWithoutPassword,
                accessToken
            }
        } else {
            throw new Error('OTP code is not valid');
        }
    },
    refreshTokenService: async(data) => {
        try {
            const { token } = data;
            const result = await jwtMiddlewareToken.refreshTokenService(token);
            
            if(result.status === 'ERROR') {
                throw new Error(result.message);
            }
            return {
                message: result.message,
                accessToken: result.access_token
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default userService;
