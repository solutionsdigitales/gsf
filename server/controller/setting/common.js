

const request = require('../../lib/request');
var chatServer = 'http://139.59.139.9';


async function findUser(userId) {
  const Req = new request(chatServer + '/users?user_id=' + userId);
  const users = await Req.getData();
  const resultType = typeof (users);

  if (resultType === 'string') {
    var data = JSON.parse(users);
    return data[0];
  } else {
    return users[0];
  }
}

module.exports = {
  chatServer,
  findUser,
}
