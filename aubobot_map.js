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
  var UserDiscordID = message.member.user.id;
  var UserAccountName = message.member.user.username;
  var UserName = message.member.nickname;
  var EventID = SplittedMsgSent[1];
  if(UserName == null)
  UserName = UserAccountName;
  UserName = UserName.split(/\W|_/g)[0];

  if (SplittedMsgSent[0] === '!helpmap') {
    message.reply("\n``Commande Bot Map:`` \nAjouter votre Position en France-> !addmap 75000\nAjouter votre Position dans le monde -> !addmap 75000;France\nMettre a jour votre Position -> !updatemap 75000\nMettre a jour votre Position dans le monde -> !updatemap 75000;France\nSupprimer votre Position -> !delmap\nAfficher la carte -> !aubemap\n\nAdmin : Nettoyer la map des personnes ayant quittées la guilde -> !cleanmap");
  }else if (SplittedMsgSent[0] === '!addmap') {
    var rolesName = ["Candidat", "Membre", "Raideur"];
    if(!message.member.roles.find(x => rolesName.indexOf(x.name) !== -1)){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
      return;
    }
    var cmd = message.content.replace('!addmap ','').split(";");
    var city = cmd[0];
    var country = (cmd[1] == undefined?"France":cmd[1]);
    if(isNaN(city)){
      message.reply("Le Code Postal entré n'est pas valide.")
      return;
    }
    request.post({ url: url, form: { add_player_map: 'true', player_id: UserDiscordID, player_name: UserName, discord_name: UserAccountName, player_city: city, player_country: country}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!delmap') {
    var rolesName = ["Candidat", "Membre", "Raideur"];
    if(!message.member.roles.find(x => rolesName.indexOf(x.name) !== -1)){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
      return;
    }
    request.post({ url: url, form: { del_player_map: 'true', discord_name: UserAccountName}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!updatemap') {
    var rolesName = ["Candidat", "Membre", "Raideur"];
    if(!message.member.roles.find(x => rolesName.indexOf(x.name) !== -1)){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
      return;
    }
    var cmd = message.content.replace('!updatemap ','').split(";");
    var city = cmd[0];
    var country = (cmd[1] == undefined?"France":cmd[1]);
    if(isNaN(city)){
      message.reply("Le Code Postal entré n'est pas valide.")
      return;
    }
    request.post({ url: url, form: { update_player_map: 'true', player_id: UserDiscordID, player_name: UserName, discord_name: UserAccountName, player_city: city, player_country: country}, headers: headers }, function (e, r, body) {
      message.reply(body)
    });
  }else if (SplittedMsgSent[0] === '!cleanmap') {
    var rolesName = ["GM"];
    if(!message.member.roles.find(x => rolesName.indexOf(x.name) !== -1)){
      message.reply("Vous n'avez pas le Grade requis pour faire ca.");
      return;
    }
    var users_lst = message.channel.guild.members;
    var rolesName = ["Candidat", "Membre", "Raideur"];

    let membersWithRole = message.guild.members.filter(member => {
      return member.roles.find(x => rolesName.indexOf(x.name) !== -1);
    }).map(member => {
      //return {"discord_name": member.user.username, "discord_user_id": member.user.id};
      return member.user.id;
    })

    var size = 500;
    var tmp_player_arr = [];
    for (var i=0; i<membersWithRole.length; i+=size) {
      tmp_player_arr = [];
      tmp_player_arr.push(membersWithRole.slice(i,i+size));
      request.post({ url: url, form: { clean_map: 'true', player_arr: tmp_player_arr}, headers: headers }, function (e, r, body) {
        message.reply(body)
      });
    }
  }else if (SplittedMsgSent[0] === '!aubemap') {
    message.reply("\n``Lien pour voir la Carte:``\nhttps://guilde-aube.fr/map");
  }
})
