var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "~";

var request = require("request")
var authinfo = require("./authinfo.json");

bot.on("message", msg => {

    if(msg.author.bot) return;  
    if (msg.author.username === "Silver Bot") return;

    if(!msg.content.startsWith(prefix)) return;

    console.log("message sent in " + msg.channel.guild.name + "\n\"" + msg.content + "\"\n");

    mes = msg.content.substring(1).trim().toLowerCase();
    if(mes.startsWith("weather")){
        var city = mes.substring(7).trim();
        request({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + authinfo.keys.weather,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var tempk = body.main.temp;
                var tempc = Math.max( Math.round((tempk - 273.15) * 10) / 10, 2.8 ).toFixed(2);
                var tempf = Math.max( Math.round((tempc * 9/5 + 32) * 10) / 10, 2.8 ).toFixed(2);

                tempc * 9/5 + 32;

                msg.channel.sendMessage("Weather in " + city + ":\n" +
                                        body.weather[0].description + "\n" +
                                        "temperature: " + tempf + "˚F/" + tempc + "˚C"); // Print the json response
            }else{
                msg.channel.sendMessage("Something went wrong. You may have typed the city name wrong or are sending too many requests.");
                console.log("error: " + error + "\n response.statusCode: " + response.statusCode);
            }
        });
    }

    if(mes.startsWith("gif")){
        topic = mes.substring(3).trim();
        request({
            url: "http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=" + authinfo.keys.giphy,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var randInt = -Math.floor(Math.random() * (0 - body.data.length + 1));
                msg.channel.sendMessage(body.data[randInt].images.original.url);
            }else{
                msg.channel.sendMessage("Something went wrong.");
                console.log("error: " + error + "\n response.statusCode: " + response.statusCode);
            }
        });
    }



    if(mes ===  "fat"){
        msg.channel.sendMessage("esdesign");
    }

    if(mes === "uptime"){
        msg.channel.sendMessage(bot.uptime / 1000 + "s");
    }
    if(mes === "rtd"){
        msg.channel.sendMessage(msg.author.username + " rolled a " + Math.floor(Math.random() * (6 - 1 + 1) + 1));
    }

    if(mes === "deletelastmsg"){
        msg.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username}`))
            .catch(console.error);
    }
    
    if(mes === "help"){
        msg.channel.sendMessage("```SilverBot was created by arocks124#9318\r\
        to use, type ~ <command>\n\
        Commands:\n\
        fat\n\
        uptime\n\
        rtd\n\
        weather (~weather <city>)\n\
        gif (~git <topic>)\n\
        \n\
        Thanks for using SilverBot!```");
    }

    if(mes === "git"){
        msg.channel.sendMessage("GitHub: https://github.com/awarren124/Silver-Bot");
    }
    
});

bot.on("guildMemberAdd", (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(authinfo.keys.discord);
