import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../libs/prisma.js';

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
    // getDetailUser: async(id) => {
    //     try {
    //         const checkUser = await User.findById(id).populate('address');
    //         if (!checkUser){
    //             return {
    //                 status: 'OK',
    //                 message: 'User is not define'
    //             }
    //         }
    //         return{
    //             status: 'OK',
    //             message: 'SUCCESS',
    //             data: checkUser
    //         }
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },
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
    // loginUser: async(user) => {
    //     const { name,  password } = user;
    //         try {
    //             const checkUser = await User.findOne({name});
    //             if(checkUser === null) {
    //                 throw new Error('User is not exist');
    //             }
    //             const comparePassword = bcrypt.compareSync(password, checkUser.password);
    //             // console.log('comparePassword: ',comparePassword);
    //             if(!comparePassword){
    //                 throw new Error('Password is not incorrect');
    //             }
                
    //             // create AccessToken
    //             const accessToken = await middlewareToken.genneralAccessToken({
    //                 id: checkUser._id,
    //                 role: checkUser.role
    //             })
    //             // create RefreshToken
    //             const refreshToken = await middlewareToken.genneralRefreshToken({
    //                 id: checkUser._id,
    //                 role: checkUser.role
    //             })

    //             const userWithoutPassword = {
    //                 ...checkUser._doc,
    //                 password: undefined,
    //                 confirmPassword: undefined,
    //             };
                
    //             return({
    //                 status: 'OK',
    //                 message: 'SUCCESS',
    //                 data: userWithoutPassword,
    //                 accessToken,
    //                 refreshToken,
    //             })
    //         } catch (error) {
    //             throw new Error(error.message);
    //         }
    // },
    // updateUser: async(userId, data) => {
    //     try {
    //         const { email, password, confirmPassword, phone, fullName } = data;
    //         const checkUser = await User.findById(userId);
    //         if(checkUser === null) {
    //             throw new Error('User is not exist');
    //         }
    //         const updateFields = {};
    //         if (email) updateFields.email = email;
    //         if (fullName) updateFields.fullName = fullName;
    //         if (phone) updateFields.phone = phone;
    //         if (password && confirmPassword) {
    //             if (password !== confirmPassword) {
    //                 throw new Error('Password and confirmPassword do not match');
    //             }
    //             const hashedPassword = bcrypt.hashSync(password, 10);
    //             updateFields.password = hashedPassword;
    //             updateFields.confirmPassword = hashedPassword;
    //         }
    //         const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    //         return({
    //             status: 'OK',
    //             message: 'SUCCESS',
    //             data: updatedUser
    //         });
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },
    // deleteUser: (userId) => {
    //     return new Promise(async(resolve, reject) => {
    //         try {
    //             const checkUser = await User.findById(userId);
                
    //             if(checkUser === null) {
    //                 resolve({
    //                     status: "OK",
    //                     message: "The user is not defined"
    //                 });
    //             }
                
    //             const updateUser = await User.findByIdAndDelete(userId);
               
    //             resolve({
    //                 status: 'OK',
    //                 message: 'Deleted User is successfully'
    //             })
    //         } catch (err) {
    //             reject(err);
    //         }
    //     });
    // },
};

export default userService;
