var request = require('request');
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', function () {
  console.log("Bot Logged In")
})

bot.login('NjE0MDA3OTk1NTQxNDg3NjE2.XV5Nig.ED9Vbs-NUIyxyWha-cTt-28LgkI')

var url = 'https://api-win.guilde-aube.fr/Bots/MapAPI/api-bot.php';
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

  if (SplittedMsgSent[0] === '!helpmap') {
    message.reply("\n``Commande Bot Map:`` \nAjouter votre Position -> !addmap (**VOTREVILLE**)\nSupprimer votre Position -> !delmap (**VOTREVILLE**)\nMettre a jour votre Position -> !updatemap (**VOTREVILLE**)\nAfficher la carte -> !aubemap");
  }else if (SplittedMsgSent[0] === '!addmap') {
    var city = message.content.replace('!addmap ','');
    request.post({ url: url, form: { add_player_map: 'true', player_name: UserName, discord_name: UserAccountName, player_city: city}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!delmap') {
    if(!message.member.roles.find(r => r.name === "Candidat") || message.member.roles.find(r => r.name === "Membre") || message.member.roles.find(r => r.name === "Raideur")){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
       return;
    }
    request.post({ url: url, form: { del_player_map: 'true', discord_name: UserAccountName}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!updatemap') {
    if(!message.member.roles.find(r => r.name === "Candidat") || message.member.roles.find(r => r.name === "Membre") || message.member.roles.find(r => r.name === "Raideur")){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
       return;
    }
    var city = message.content.replace('!updatemap ','');
    request.post({ url: url, form: { update_player_map: 'true', player_name: UserName, discord_name: UserAccountName, player_city: city}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!aubemap') {
    message.reply("Lien pour voir la Carte:\nhttps://guilde-aube.fr/map");
  }
})
