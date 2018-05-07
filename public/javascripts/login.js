$('#loginForm').submit(function (e) {
  var username = $('#username').val().trim();
  sessionStorage.username = username
});
