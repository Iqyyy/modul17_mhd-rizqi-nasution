const jwt = require('jsonwebtoken');


SECRET = process.env.SECRET

const Auth = {
    verifyToken(req, res, next){
        
        
        // const token = req.cookies['token']
         const {token} = req.body
        
        console.log(JSON.stringify(token))

        if (token) {
            // 12. Lakukan jwt verify 
            const verified = jwt.verify(token, SECRET)
            req.verified = verified.userid
            
            if(verified) {
              console.log("Succesfully Verified")
              return next()
            }
        } else {
          res.status(403).send({message: 'Youre not authenticated, please login first'})
            console.log('Youre not authenticated');
        }
      
      return next();
    
  }
}

module.exports = Auth;