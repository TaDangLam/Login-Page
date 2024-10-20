import jwt from 'jsonwebtoken';

const jwtMiddlewareToken = {
    genneralAccessToken: async(payload) => {
        const access_token = jwt.sign({ payload }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
        return access_token;
    },
    genneralRefreshToken: async(payload) => {
        const refresh_token = jwt.sign({ payload }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
        return refresh_token;
    },
    refreshTokenService: (token) => {
        return new Promise((resolve, reject) => {
            // const newToken = token.split(' ')[1];
            // console.log(token);
            try {
                jwt.verify(token, process.env.REFRESH_TOKEN, async(err, user) => {
                    if(err || !user || !user.payload) {
                        resolve({
                            status: 'ERROR',
                            message: 'The Authentication is Failed'
                        })
                    } else {
                        const { payload } = user;
                        const access_token = await jwtMiddlewareToken.genneralAccessToken({
                            id: payload?.id,
                            role: payload?.role
                        });
                        resolve({
                            status: 'OK',
                            message: 'SUCCESS',
                            access_token
                        });
                    }  
                });
            } catch (error) {
                reject({
                    status: 'ERROR',
                    message: 'Error generating new access token',
                    error: error.message
                })
            }
        })
    }
}

export default jwtMiddlewareToken;
