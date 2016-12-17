var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "~";

bot.on("message", msg => {

	if(msg.author.bot) return;  
	// console.log(msg.content.substring(3).trim().toLowerCase());
	//msg.channel.id === "254062866682871808" && 
    if (msg.author.username === "Silver Bot") return;

    if(!msg.content.startsWith(prefix)) return;

    //msg.content = msg.content.substring(3);//.trim();
    mes = msg.content.substring(1).trim().toLowerCase();

    if(mes ===  "fat"){
    	msg.channel.sendMessage("esdesign");
    }

    if(mes === "uptime"){
        msg.channel.sendMessage(bot.uptime / 1000 + "s");
    }
    
    if(mes === "help"){
    	msg.channel.sendMessage("```SilverBot was created by arocks124#9318\r\
        to use, type ~ <command>\n\
    	Commands:\n\
    	fat\n\
        uptime\n\
    	\n\
    	Thanks for using SilverBot!```");
    }

    
});

bot.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("token");
