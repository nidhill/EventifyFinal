export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userauth/showlogin');
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userauth/home');
};

export const DontHaveAnAccount = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userauth/home');
};
