var request = require('request');
var moment = require('moment');
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', function () {
  console.log("Bot Logged In")
})

bot.login('NTkxNjMyMTU5OTM3MjY1NzU5.XVuu2Q.dspvBNuF1Ieq_PISEpcuRHf_YE8')

var url = 'https://api-win.guilde-aube.fr/Bots/RaidsAPI/api-bot.php';
var headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
  'Content-Type' : 'application/x-www-form-urlencoded'
};

bot.on('message', message => {
  var SplittedMsgSent = message.content.split(" ");
  var UserAccountName = message.member.user.username;
  var UserName = message.member.nickname;
  var EventID = SplittedMsgSent[1];
  if(UserName == null)
  UserName = UserAccountName;
  UserName = UserName.split(/\W|_/g)[0];

  if (SplittedMsgSent[0] === '!sub') {
    var player_comment = message.content.replace('!sub','').replace(/[0-9]+/, '');
    request.post({ url: url, form: { sub_player: 'true', player: UserName, pnote: player_comment, event_id: EventID}, headers: headers }, function (e, r, body) {
      message.reply("Raid #"+EventID+", " + body)
    });
  }else if (SplittedMsgSent[0] === '!unsub') {
    request.post({ url: url, form: { unsub_player: 'true', player: UserName, event_id: EventID}, headers: headers }, function (e, r, body) {
      message.reply("Raid #"+EventID+", " + body)
    });
  }else if (SplittedMsgSent[0] === '!raids') {
    request.post({ url: url, form: { raid_lst: 'true'}, headers: headers }, function (e, r, body) {
      message.channel.send(body);
    });
  }else if (SplittedMsgSent[0] === '!myraids') {
    request.post({ url: url, form: { player_raid_lst: 'true', player: UserName}, headers: headers }, function (e, r, body) {
      message.reply(body);
      //message.author.send(body);
    });
  }else if (SplittedMsgSent[0] === '!addevent') {
    if(!message.member.roles.find(r => r.name === "GM") || message.member.roles.find(r => r.name === "Officier")){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
       return;
    }
    //!addevent (MC + BWL) (28/09/19 21:00)
    var cmd = message.content.replace('!addevent ','').match(/\((.*?)\)/g).map(b=>b.replace(/\(|(.*?)\)/g,"$1"))
    var event_name = cmd[0];
    var date_str = cmd[1];
    var event_date = moment(date_str, 'D/M/YY hh:mm').unix();
    request.post({ url: url, form: { new_event: 'true', creator: UserName, ev_name: event_name, ev_date: event_date}, headers: headers }, function (e, r, body) {
      message.reply(body);
    });
  }else if (SplittedMsgSent[0] === '!delevent') {
    if(!message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Test")){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
       return;
    }
    request.post({ url: url, form: { del_event: 'true', ev_id: EventID}, headers: headers }, function (e, r, body) {
      message.reply(body);
    });
  }

})
