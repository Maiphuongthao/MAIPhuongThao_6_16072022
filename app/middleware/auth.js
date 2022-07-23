const jwt = require("jsonwebtoken");

// verify if user is connected to transfert connection infos to differents methods

module.exports = (req, res, next) => {
  try {
    //get header and split it after space which is 2nd

    const token = req.headers.authorization.split(" ")[1];
    
    //decode the token
    
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    

    //get userId as decode token userID
    // console.log(decodedToken.userId);
    const userId = decodedToken.userId;
   
    //add this value to request to call it after
    req.auth = {
      userId: userId,
    };

    //Check if userId exist in body and if it isn't the same as userID of sauce then return error message, if not continue
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ error: "unauthorized requets" + error });
    } else {
      next();
    }
  } catch(error) {
    //console.log(error);
    res.status(403).json({ error: "unauthorized request" });
  }
};
