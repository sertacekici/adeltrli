const jwt = require("jsonwebtoken");
const config = require("../fb/config");

module.exports = async (req, res, next) => {
  const token = req.cookies._usertoken;

  // Bu kisimda token kontrol edilecek. Eger token yoksa login olmamiz gerekiyor.

  if (!token || token === "null") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.jwtp);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  req.username = decodedToken.username;
  req.userpass = decodedToken.userpass;

  next();
};
