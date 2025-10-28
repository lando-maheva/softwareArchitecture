import jwt from 'jsonwebtoken';


function jwtTokens({user_id,user_name,user_email}){
    const user = {user_id,user_name,user_email};
   const accessToken = jwt.sign(
    user,                                       // The payload (the data to encode)
    process.env.ACCESS_TOKEN_SECRET,            // The secret key (it is read from .env)
    { expiresIn: '60s' }                        // The options
);

const refreshToken = jwt.sign(
    user,                                       // The payload
    process.env.REFRESH_TOKEN_SECRET,           // The secret key
    { expiresIn: '60s' }                        // The options
);

    return ({accessToken,refreshToken});
}



export {jwtTokens};