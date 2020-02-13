var request = require('request');
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', function () {
	console.log("Bot Logged In");
	bot.user.setActivity('<> !dmaphelp for commands');
})

bot.login('NjE0MDA3OTk1NTQxNDg3NjE2.XkOtCw.22nF1cclVRHtzJEcR5C9eaQh3yM')

var url = 'https://api.discordmapper.com/api-bot.php';
var headers = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
	'Content-Type' : 'application/x-www-form-urlencoded'
};

bot.on('message', message => {
	
	if(message.channel.type === "dm")
	return;
	
	var ParsedMsg = message.content.split(" ");
	var CommandRequest = ParsedMsg[0];
	var CMD  = ["!dmaphelp", "!dmmakemap", "!dmapadd", "!dmapdelete", "!dmapupdate", "!dmaplink"];
	if(CMD.indexOf(CommandRequest) !== -1){
		var ServerID = bot.guilds.get(message.guild.id).id;
		var UserDiscordID = (message.member.user.id).toString('base64');
		var UserAccountName = (message.member.user.username).toString('base64');
		var UserName = (message.member.nickname == null?message.member.user.username:message.member.nickname).toString('base64');
	}
	
	if (CommandRequest === '!dmaphelp') {
		message.author.send("\n``Commande Bot Map:`` \nAjouter votre Position en France-> !dmapadd **75000**\nAjouter votre Position dans le monde -> !dmapadd **75000**;**France**\nMettre a jour votre Position en France -> !dmapupdate **75000**\nMettre a jour votre Position dans le monde -> !updatemap **75000**;**France**\nSupprimer votre Position -> !dmapdelete\nAfficher la carte -> !discordmap");
		message.delete(1000);
		}else if (CommandRequest === '!dmmakemap') {
      if (!message.member.hasPermission("ADMINISTRATOR")) 
      return message.reply('You are not the Admin of this Discord Server!')
      var UserData = {user_id: message.member.user.id, user_name: message.member.user.username, user_hashtag: message.member.user.discriminator, user_roles: message.member.roles ? message.member.roles.map(r => `${r.name}`).join(' | ') : ""};
		request.post({ url: url, form: { make_map: 'true', server_id: ServerID, server_name: message.guild.name, user_data: UserData}, headers: headers }, function (e, r, body) {
      console.log(message.member.roles);
			message.reply(body);
			// message.author.send(body);
			message.delete(1000);
		});
		}else if (CommandRequest === '!dmapadd') {
		var cmd = message.content.replace('!dmapadd ','').split(";");
		var city = cmd[0].trim();
		var country = (cmd[1] == undefined?"France":cmd[1].trim());
		if(isNaN(city)){
			message.reply("Le Code Postal entré n'est pas valide.");
			message.delete(1000);
			return;
		}
		request.post({ url: url, form: { add_player_map: 'true', player_id: UserDiscordID, player_name: UserName, discord_name: UserAccountName, player_city: city, player_country: country}, headers: headers }, function (e, r, body) {
			message.author.send(body);
			message.delete(1000);
		});
		}else if (CommandRequest === '!dmapdelete') {
		request.post({ url: url, form: { del_player_map: 'true', discord_name: UserAccountName}, headers: headers }, function (e, r, body) {
			message.author.send(body);
			message.delete(1000);
		});
		}else if (CommandRequest === '!dmapupdate') {
		var cmd = message.content.replace('!dmapupdate ','').split(";");
		var city = cmd[0].trim();
		var country = (cmd[1] == undefined?"France":cmd[1].trim());
		if(isNaN(city)){
			message.reply("Le Code Postal entré n'est pas valide.");
			message.delete(1000);
			return;
		}
		request.post({ url: url, form: { update_player_map: 'true', player_id: UserDiscordID, player_name: UserName, discord_name: UserAccountName, player_city: city, player_country: country}, headers: headers }, function (e, r, body) {
			message.author.send(body);
			message.delete(1000);
		});
		}else if (CommandRequest === '!dmaplink') {
		message.reply(ServerID);
		// message.reply("\n``Lien pour voir la Carte:``\nhttps://google.com/map\n**!dmaphelp** pour voir les commandes disponibles");
	}
})
