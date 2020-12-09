const User = require('../models/user');

module.exports = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      return next();
    }
  
    const user = await User.findOne({token: token});
    
    if(user){
        Object.assign(req, {user, isAuthenticated: true });
    }

    next();
  };

