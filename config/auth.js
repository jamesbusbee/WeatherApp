module.exports = {
  ensureAuthenticated: function(request, response, next){
    if(request.isAuthenticated()){
      return next();
    }
    request.flash('error_msg', 'You must be logged in to view this resource');
    response.redirect('/users/login');
  }
};
