import bcrypt from 'bcrypt';

import prisma from '../libs/prisma.js';
import jwtMiddlewareToken from '../middleware/jwtMiddleware.js';

const userService = {
    getAllUser: async() => {
        try {
            const allUser = await prisma.user.findMany();
            return {
                status: 'OK',
                message: 'Get all user is success',
                data: allUser
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
                
                // create AccessToken
                const accessToken = await jwtMiddlewareToken.genneralAccessToken({
                    id: checkUser._id,
                    role: checkUser.role
                })
                // create RefreshToken
                const refreshToken = await jwtMiddlewareToken.genneralRefreshToken({
                    id: checkUser._id,
                    role: checkUser.role
                })

                const updatedUser = await prisma.user.update({
                    where: { id: checkUser.id },
                    data: {
                        lastLogin: new Date()
                    }
                });
                
                const userWithoutPassword = {
                    ...updatedUser,
                    password: undefined,
                    role: undefined,
                    confirmPassword: undefined,
                };
                
                return({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: userWithoutPassword,
                    accessToken,
                    refreshToken,
                })
            } catch (error) {
                throw new Error(error.message);
            }
    }
};

export default userService;
