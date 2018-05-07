const User = require('../User')

class ChatHandler{

  constructor(){

    this.users = Array()
    this.logoOrientation = 'normal'
    this.broadcastMessage = ''

  }

  handleUserLogin(userCredentials, socket){

    this.updateLogoOrientation(socket)
    this.updateBroadcastMessage(socket)

    var username;
    var rank;
    // username, color, rank, socket

    username = this.isValidMessage( userCredentials.username ) ? userCredentials.username : 'none'

    userCredentials.password == 'izi' ? function() {rank = 'admin' ; username = '~~' + username }() : rank = 'user'

    var user = new User(username,rank,socket)

    this.addUserToList(user.userInfos)

    console.log(user.userInfos.username + ' joined the chat, added him in the users\'s list.');
    console.log(this.users.length + " user(s) online ! ");

    io.emit('user_connected', user.userInfos);

    // </test trié par pseudo
    var sortedUsers = this.users.slice(0);
    sortedUsers.sort( (a,b) => {
      var x = a.username.toLowerCase();
      var y = b.username.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    // test>
    io.emit('update_userlist', sortedUsers)

    user.socket.on('disconnect', () => this.onDisconnect(user) );

    user.socket.on('chat-message', (message) => this.onMessage(user.userInfos, message));

  }

  onDisconnect(user){

    this.users.splice(this.users.indexOf(user.userInfos), 1)
    io.emit('user_disconnected', user.userInfos);
    console.log(user.userInfos.username + " disconnected, good bye !")

  }

  onMessage(userInfos, message){

    if(!this.isValidMessage(message.text)){
      message.text = "[Deleted message] you can't use inputs here ! If you want to show an image type !show image_src";
    }
    else if(this.isALink(message.text)){
      message.text = '<a target="_blank" href="'+message.text+'">'+message.text+'</a>';
    }
    else{

      var tempMessage = message.text.split(' ');
      switch(tempMessage[0]){

        case '!show':
          var href = message.text.replace('!show', ' ');
          href = '<a target="_blank" href="'+ href + '">';
          message.text = message.text.replace('!show','<img class="imgChat" src="');
          message.text =href + message.text + '"></a>';
          break;
        case '!clusterfuck' :
          message.text = '<script>document.location.href="/cluster";</script>';
          break;
        case '!broadcast':
          if(userInfos.rank == 'admin'){
            var text = message.text.replace('!broadcast','');
            message.text = "Abrakadabra";
            this.changeBroadcastMessage(text)
          }
          break;
        case '!logo' :
          if(userInfos.rank == 'admin'){
            if(this.logoOrientation == 'normal'){
              io.emit('rotate_logo', 'logo logoRotateF');
              this.logoOrientation = 'reversed';
              message.text = 'Abrakadabra';
              console.log(this.logoOrientation)

            }else
            {
              io.emit('rotate_logo', 'logo logoRotateY');
              this.logoOrientation = 'normal';
              message.text = 'Abrakadabra';
              console.log(this.logoOrientation)

            }
          }
          break;

      }
    }

    message.version=2;
    message.username = "C:\\" + userInfos.rank.charAt(0).toUpperCase() + userInfos.rank.substr(1) + "s\\" + userInfos.username + ">";

    console.log(message.username + " : " + message.text);

    // envoie le message a tous les clients connectés
    io.emit('chat-message', message);

    //user.socket.broadcast.emit('play-sound-message');
  }

  updateLogoOrientation(socket){
    if(this.logoOrientation != 'normal'){
      socket.emit('rotate_logo', 'logo logoRotateF');
    }
  }

  updateBroadcastMessage(socket){
    socket.emit('change_slide_text', this.broadcastMessage)
  }

  changeBroadcastMessage(message){
    this.broadcastMessage = message
    io.emit('change_slide_text', message);
  }

  addUserToList(user){

    this.users.push(user)

  }

  isValidMessage(message){
    console.log("if")
    var rules = new Array('!doctype',
                        '<!--',
                        '<applet',
                        '<area',
                        '<b',
                        '<base',
                        '<basefont',
                        '<bdo',
                        '<bgsound',
                        '<body',
                        '<button',
                        '<center',
                        '<code',
                        '<col',
                        '<colgroup',
                        '<dd',
                        '<del',
                        '<dfn',
                        '<dir',
                        '<div',
                        '<dl',
                        '<dt',
                        '<embed',
                        '<fieldset',
                        '<font',
                        '<form',
                        '<frame',
                        '<frameset',
                        '<head',
                        '<hr',
                        '<html',
                        '<iframe',
                        '<img',
                        '<input',
                        '<ins',
                        '<isindex',
                        '<label',
                        '<layer',
                        '<legend',
                        '<li',
                        '<link',
                        '<map',
                        '<marquee',
                        '<menu',
                        '<meta',
                        '<nextid',
                        '<nobr',
                        '<noembed',
                        '<noscript',
                        '<object',
                        '<ol',
                        '<option',
                        '<p',
                        '<param',
                        '<pre',
                        '<q',
                        '<s',
                        '<samp',
                        '<script',
                        '<select',
                        '<small',
                        '<span',
                        '<strike',
                        '<strong',
                        '<style',
                        '<sub',
                        '<sup',
                        '<table',
                        '<tbody',
                        '<td',
                        '<textarea',
                        '<tfoot',
                        '<th',
                        '<thead',
                        '<title',
                        '<tr',
                        '<tt',
                        '<u',
                        '<ul',
                        '<var',
                        '<wbr',
                        '<xmp',
                        '~~')

        message = message != undefined ? message.toLowerCase() : ''

        return rules.every( (word) => { return !message.includes(word) } )

  }

  isALink(message){
    console.log("elseif")
    //var pattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\d%_.~+=-]*)?'+ '(\\#[-a-z\d_]*)?$','i');

    //return pattern.test(message)
    return false;

  }

}

const instance = new ChatHandler()

module.exports = instance
