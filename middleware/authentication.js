import jwt from 'jsonwebtoken';


function authenticationToken(req,res,next){
    // we need to get the token from the authorisation header

    const authHeader = req.headers['authorization']; //bearer token
    const token = authHeader && authHeader.split(' ')[1]; // this line checks that the header is not null and splits it to get the token only
    
    if(token == null )return res.sendStatus(401); // if there is no token we send a 401 unauthorizes status

    //if there is a token we verify if it is valid with the secret key

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        
        //Handle invalid token 
        if(err) {
            
            return res.status(401).json({
                error: "Invalid or expired token",
                details: err.message 
            });
        }
        
        //  Token is valid, proceed
        req.user = user;
        next();
    });
}


export {authenticationToken}

