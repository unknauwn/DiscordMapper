var request = require('request');
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.on('ready', function () {
	console.log("Bot Logged In");
	bot.user.setActivity('<> !maphelp for commands');
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
	var CMD  = ["!map", "!maphelp", "!mapinit", "!mapadd", "!mapupdateimage", "!mapdelete", "!mapupdate", "!mapdistance", "!mapclean", "!maprefresh"];
	if(CMD.indexOf(CommandRequest) !== -1){
		var ServerID = bot.guilds.get(message.guild.id).id;
		var UserDiscordID = (message.member.user.id).toString('base64');
		var UserAccountName = (message.member.user.username).toString('base64');
		var UserName = (message.member.nickname == null?message.member.user.username:message.member.nickname).toString('base64');
	}
	
	if (CommandRequest === '!maphelp') {
		const embed = new Discord.RichEmbed()
		.setTitle("DiscordMapper Commands List")
		.setAuthor("DiscordMapper", "https://discordmapper.com/assets/img/discordmapper_logo.png")
		.setColor(0x3D85C6)
		.setDescription(":round_pushpin: To get your Latitude & Longitude:\n:one:. Go to [DiscordMapper](http://discordmapper.com/map)\n:two:. Scroll to desired location, click on it(Lat & Lng will be auto-copied to clipboard)\n:three:. Paste on your Discord Server after the command.(eg: !mapadd **PAST_HERE**)")
			.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
			.setTimestamp()
			.setURL("http://discordmapper.com")
			.addField(":unlock: **Commands**", "**!maphelp** This show you all availables commands.\n"+
			"**!mapadd LAT;LNG** Add your position on the map(eg: !mapadd 11.13371337;11.13371337)\n"+
			"**!mapupdate LAT;LNG** Update your position on the map(eg: !mapadd 11.13371337;11.13371337)\n"+
			"**!mapupdateimage URL_IMAGE** Update your Image on the map to your Pos\n"+
			"**!mapdelete** Delete your position on the map"+
			"**!mapdistance TAG_USER** Return distance between you and the user mentionned\n", true)
			.addBlankField()
			.addField(":lock: **Commands Admin**", "**!mapinit** This allow you to create your Server Map.\n"+
			"**!mapclean** Remove all users from Map there are not anymore on your Discord\n"+
			"**!maprefresh** Refresh all users information like Nickname, Roles etc\n", true)
			.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
			message.channel.send({embed});
			
			message.delete(1000);
		}else if (CommandRequest === '!mapinit') {
			if (!message.member.hasPermission("ADMINISTRATOR"))
			return message.reply('You are not the Admin of this Discord Server!')
			var UserData = {user_id: message.member.user.id, user_nickname: message.member.nickname == null?message.member.user.username:message.member.nickname, user_name: message.member.user.username, user_hashtag: message.member.user.discriminator, user_roles: message.member.roles ? message.member.roles.map(r => `${r.name}`).join(' | ') : ""};
			request.post({ url: url, form: { make_map: 'true', server_id: ServerID, server_name: message.guild.name, user_data: UserData}, headers: headers }, function (e, r, body) {
				var response = JSON.parse(body);
				const embed = new Discord.RichEmbed()
				.setTitle("Server: "+message.guild.name)
				.setAuthor("DiscordMapper", message.guild.iconURL)
				.setColor(0x3D85C6)
				.setDescription(":information_source: "+response.msg)
				.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
				.setTimestamp()
				.setURL("http://discordmapper.com/map?map="+response.url)
				.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
					.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
					message.reply({embed});
					// message.author.send(body);
					message.delete(1000);
				});
			}else if (CommandRequest === '!mapadd') {
				var cmd = message.content.replace(CommandRequest,'');
				var splitCoordinates = cmd.split(/;/);
				if(!isValidCoordinates(cmd)){
					message.reply("The Coordinate are wrong, please verify.");
					message.delete(1000);
					return;
				}
				var UserData = {user_id: message.member.user.id, user_nickname: message.member.nickname == null?message.member.user.username:message.member.nickname, user_name: message.member.user.username, user_hashtag: message.member.user.discriminator, user_roles: message.member.roles ? message.member.roles.map(r => `${r.name}`).join(' | ') : ""};
				var LatLng = {lat: splitCoordinates[0], lng: splitCoordinates[1]};
				
				request.post({ url: url, form: { add_user_map: 'true', user_id: UserDiscordID, user_name: UserName, discord_name: UserAccountName, user_data: UserData, user_server: ServerID, user_location: LatLng}, headers: headers }, function (e, r, body) {
					var response = JSON.parse(body);
					const embed = new Discord.RichEmbed()
					.setTitle("Server: "+message.guild.name)
					.setAuthor("DiscordMapper", message.guild.iconURL)
					.setColor(0x3D85C6)
					.setDescription(":information_source: "+response.msg)
					.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
					.setTimestamp()
					.setURL("http://discordmapper.com/map?map="+response.url)
					.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
						.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
						message.reply({embed});
						// message.author.send(body);
						message.delete(1000);
					});
				}else if (CommandRequest === '!mapupdateimage') {
					var cmd = message.content.replace(CommandRequest,'');
					var imgUrl = cmd.replace(/\s+/g, '');
					request.post({ url: url, form: { update_img: 'true', user_id: UserDiscordID, user_img_url: imgUrl, user_server: ServerID}, headers: headers }, function (e, r, body) {
						var response = JSON.parse(body);
						const embed = new Discord.RichEmbed()
						.setTitle("Server: "+message.guild.name)
						.setAuthor("DiscordMapper", message.guild.iconURL)
						.setColor(0x3D85C6)
						.setDescription(":information_source: "+response.msg)
						.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
						.setTimestamp()
						.setURL("http://discordmapper.com/map?map="+response.url)
						.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
							.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
							message.reply({embed});
							//message.author.send(body);
							message.delete(1000);
						});
					}else if (CommandRequest === '!mapupdate') {
						var cmd = message.content.replace(CommandRequest,'');
						var splitCoordinates = cmd.split(/;/);
						if(!isValidCoordinates(cmd)){
							message.reply("The Coordinate are wrong, please verify.");
							message.delete(1000);
							return;
						}
						var UserData = {user_id: message.member.user.id, user_nickname: message.member.nickname == null?message.member.user.username:message.member.nickname, user_name: message.member.user.username, user_hashtag: message.member.user.discriminator, user_roles: message.member.roles ? message.member.roles.map(r => `${r.name}`).join(' | ') : ""};
						var LatLng = {lat: splitCoordinates[0], lng: splitCoordinates[1]};
						
						request.post({ url: url, form: { update_user_map: 'true', user_id: UserDiscordID, user_name: UserName, discord_name: UserAccountName, user_data: UserData, user_server: ServerID, user_location: LatLng}, headers: headers }, function (e, r, body) {
							var response = JSON.parse(body);
							const embed = new Discord.RichEmbed()
							.setTitle("Server: "+message.guild.name)
							.setAuthor("DiscordMapper", message.guild.iconURL)
							.setColor(0x3D85C6)
							.setDescription(":information_source: "+response.msg)
							.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
							.setTimestamp()
							.setURL("http://discordmapper.com/map?map="+response.url)
							.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
								.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
								message.reply({embed});
								//message.author.send(body);
								message.delete(1000);
							});
						}else if (CommandRequest === '!mapdelete') {
							request.post({ url: url, form: { del_user_map: 'true', user_id: UserDiscordID, user_server: ServerID}, headers: headers }, function (e, r, body) {
								var response = JSON.parse(body);
								const embed = new Discord.RichEmbed()
								.setTitle("Server: "+message.guild.name)
								.setAuthor("DiscordMapper", message.guild.iconURL)
								.setColor(0x3D85C6)
								.setDescription(":information_source: "+response.msg)
								.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
								.setTimestamp()
								.setURL("http://discordmapper.com/map?map="+response.url)
								.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
									.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
									message.reply({embed});
									//message.author.send(body);
									message.delete(1000);
								});
							}else if (CommandRequest === '!mapdistance') {
								var cmd = message.content.replace(CommandRequest,'');
								var userFrom = UserDiscordID;
								var userTo = message.mentions.users.first().id;
								request.post({ url: url, form: { user_distance_map: 'true', users_from_id: userFrom, users_to_id: userTo, user_server: ServerID}, headers: headers }, function (e, r, body) {
									var response = JSON.parse(body);
									const embed = new Discord.RichEmbed()
									.setTitle("Server: "+message.guild.name)
									.setAuthor("DiscordMapper", message.guild.iconURL)
									.setColor(0x3D85C6)
									.setDescription(":information_source: "+response.msg)
									.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
									.setTimestamp()
									.setURL("http://discordmapper.com/map?map="+response.url)
									.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
										.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
										message.reply({embed});
										//message.author.send(body);
										message.delete(1000);
									});
								}else if (CommandRequest === '!map') {
									const embed = new Discord.RichEmbed()
									.setTitle("Server: "+message.guild.name)
									.setAuthor("DiscordMapper", message.guild.iconURL)
									.setColor(0x3D85C6)
									.setDescription(":information_source: Click on the following link to see the Server Map :map: ["+message.guild.name+"'s Server Map](http://discordmapper.com/map?map="+ServerID+").")
										.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
										.setTimestamp()
										.setURL("http://discordmapper.com")
										.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
											.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
											message.channel.send({embed});
											message.delete(1000);
											// message.reply("\n``Lien pour voir la Carte:``\nhttps://google.com/map\n**!dmaphelp** pour voir les commandes disponibles");
										}else if (CommandRequest === '!mapclean') {
											if (!message.member.hasPermission("ADMINISTRATOR"))
											return message.reply('You are not the Admin of this Discord Server!')
											
											var Users_lst = message.channel.guild.members.map(member => member.user.id);
											
											request.post({ url: url, form: { clean_map: 'true', users_lst: Users_lst, user_server: ServerID}, headers: headers }, function (e, r, body) {
												var response = JSON.parse(body);
												const embed = new Discord.RichEmbed()
												.setTitle("Server: "+message.guild.name)
												.setAuthor("DiscordMapper", message.guild.iconURL)
												.setColor(0x3D85C6)
												.setDescription(":information_source: "+response.msg)
												.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
												.setTimestamp()
												.setURL("http://discordmapper.com/map?map="+response.url)
												.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
													.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
													message.reply({embed});
													message.delete(1000);
												});
											}else if (CommandRequest === '!maprefresh') {
												if (!message.member.hasPermission("ADMINISTRATOR"))
												return message.reply('You are not the Admin of this Discord Server!')
												
												var Users_data = message.guild.members.map(member => ({user_id: member.user.id, user_nickname: member.nickname == null?member.user.username:member.nickname, user_name: member.user.username, user_hashtag: member.user.discriminator, user_roles: member.roles ? message.member.roles.map(r => `${r.name}`).join(' | ') : ""}));
												
												request.post({ url: url, form: { refresh_map: 'true', users_data: Users_data, user_server: ServerID}, headers: headers }, function (e, r, body) {
													var response = JSON.parse(body);
													const embed = new Discord.RichEmbed()
													.setTitle("Server: "+message.guild.name)
													.setAuthor("DiscordMapper", message.guild.iconURL)
													.setColor(0x3D85C6)
													.setDescription(":information_source: "+response.msg)
													.setThumbnail("https://discordmapper.com/assets/img/discordmapper_logo.png")
													.setTimestamp()
													.setURL("http://discordmapper.com/map?map="+response.url)
													.addField('\u200b', ":link: Visit us on [DiscordMapper.com](http://discordmapper.com) | **!maphelp** for commands", true)
														.setFooter(`@${message.author.tag}.`, message.author.displayAvatarURL);
														message.reply({embed});
														message.delete(1000);
													});
												}
											})
											
											function isValidCoordinates(coordinates){
												var args = coordinates.split(/;/);
												var lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
												var lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
												//console.log("'" + args[0] + "', '" +  args[1] + "'");
												if(lat.test(args[0].trim()) == true && lon.test(args[1].trim()) == true){
													return true;
												} else{
													return false;
												}
											}
