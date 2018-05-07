var socket = io();

function joinedChat(){
  console.log("Joined chat")
  var user = {
    username : sessionStorage.username,
    password : ""
  };
  socket.emit('user-login', user);
  $('#messageInput').focus();
  $('#currentUser').html(user.username);
}

window.onload = joinedChat
/**
 * champ de saisie des messages
 */
$('#formSendMessage').submit(function(e) {
    e.preventDefault();
    // On crée notre objet JSON correspondant à notre message
    var message = {
        text : $('#messageInput').val()
    }

    $('#messageInput').val(''); // On vide le champ texte
    if (message.text.trim().length !== 0) { // Gestion message vide
      socket.emit('chat-message', message);
    }
    $('#messageInput').focus(); // Focus sur le champ du message

});

$( "#useractions_private_message" ).click(function() {
  alert( "click" );
});

$( "#useractions_close" ).click(function() {
  $("#useractions").css("display", "none")
});

$("#users").on('click', 'li', function() {

  $("#useractions_username").html($("#"+this.id).find(".username").html())
  $("#useractions").css("display", "block")
});

/**
 * Connection d'un utilisateur
 */
socket.on('user_connected', function (user) {
  console.log("user connected (socket)")
  $('#chatMessages').append($('<div>').html(user.username + " joined the room !"));
});

/**
 * Reception de la liste des utilisateurs déjà connectés
 */

 socket.on('update_userlist', function(users){

   $("#chatUsers").html("")
   for (let user of users){
     $('#chatUsers').append($('<div id="'+user.id+'">').html('<span class="">'+user.username + '</span> '));
   }

 })

/**
 * Deconnection d'un utilisateur
 */

socket.on('user_disconnected', function (user){
  $('#chatMessages').append($('<div>').html(user.username + " left the room ... Cya"));
  $('#'+user.id).remove();

});

/**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {

	switch(message.version){
		case 2:
			$('#chatMessages').append($('<div>').html('<span class="">' + message.username + '</span> ' + '<span style="color:#FFF">' +message.text + '</span> '));
			break;
		default:
			$('#chatMessages').append($('<div>').html(message.text));
  		break;
	}
	scrollToBottom();
});

socket.on('play-sound-message', function (message) {
  document.getElementById('audioplayer').play();
});


socket.on('change_slide_text', function(text){
  $('#slide_text').text(text);
});

socket.on('rotate_logo', function(mode){
 $('#logo').attr('class', mode);
});

/**
 * Scroll vers le bas de page si l'utilisateur n'est pas remonté pour lire d'anciens messages
 */
function scrollToBottom() {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $("html, body").animate({ scrollTop: $(document).height() }, 0);
  }
}
