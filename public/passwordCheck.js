function passwordCheck() {
    let password = $("#password").val();
    let pwCheck = $("#confirmPassword").val();

    switch(password == pwCheck){
      case false:
        $("#passwordCheck").html("Passwords don't match!");
        $("#passwordCheck").toggleClass("text-warning");
        break;
      case true:
        $("#passwordCheck").html("Looks good!");
        $("#passwordCheck").toggleClass("text-warning");
        $("#passwordCheck").toggleClass("text-success");
        break;
      case null:
        $("#passwordCheck").html("Password time :)");
        break;
    }
}

$(document).ready(function () {
   $("#password, #confirmPassword").keyup(passwordCheck);
});
