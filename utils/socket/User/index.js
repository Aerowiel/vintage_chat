class User {

  constructor(username, rank, socket){
    this.userInfos = {'username' : username, 'rank' : rank, id : socket.id}

    this.socket = socket
  }

}

module.exports = User
