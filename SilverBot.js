var Discord = require("discord.js");
var bot = new Discord.Client();
var prefix = "~";

var request = require("request")
var authinfo = require("./authinfo.json");
var unirest = require("unirest");

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
            if (!error && response.statusCode === 200 && body.data.length !== 0) {
                var randInt = -Math.floor(Math.random() * (0 - body.data.length + 1));
                msg.channel.sendMessage(body.data[randInt].images.original.url);
            }else if(body.data.length === 0){
                msg.channel.sendMessage("No gifs found");
            }else{
                msg.channel.sendMessage("Something went wrong.");
                console.log("error: " + error + "\n response.statusCode: " + response.statusCode);
            }
        });
    }

    if(mes.startsWith("shorten")){
        var longURL = msg.content.substring(8).trim();
        if(!longURL.startsWith("http")){
            longURL = "http://" + longURL;
        }
        unirest.get("http://api.bit.ly/v3/shorten?format=json&login=" + authinfo.logins.bitly + "&apiKey=" + authinfo.keys.bitly + "&longUrl=" + longURL)
        .header("Accept", "application/json")
        .end(function (result) {
            console.log("http://api.bit.ly/v3/shorten?format=json&login=" + authinfo.logins.bitly + "&apiKey=" + authinfo.keys.bitly + "&longUrl=" + longURL);
            if(result.body.status_txt === "INVALID_URI"){
                msg.sendMessage("The URL you entered is invalid.");
            }else{
                msg.channel.sendMessage(result.body.data.url);
            }
        });
    }

    if(mes.startsWith("expand")){
        var shortURL = msg.content.substring(7).trim();
        if(!shortURL.startsWith("http")){
            shortURL = "http://" + shortURL;
        }
        unirest.get("http://api.bit.ly/v3/expand?format=json&login=" + authinfo.logins.bitly + "&apiKey=" + authinfo.keys.bitly + "&shortUrl=" + shortURL)
        .header("Accept", "application/json")
        .end(function (result) {
            console.log("http://api.bit.ly/v3/expand?format=json&login=" + authinfo.logins.bitly + "&apiKey=" + authinfo.keys.bitly + "&shortUrl=" + shortURL);
            if(result.body.data.expand[0].hasOwnProperty("error")){
                msg.channel.sendMessage("The URL you entered is invalid. Make sure it starts with bit.ly, or j.mp")
            }else{
                msg.channel.sendMessage(result.body.data.expand[0].long_url);
            }
        });
    }

    if(mes.startsWith("echo")){
        msg.channel.sendMessage(msg.content.substring(5).trim());
    }

    if(mes.startsWith("urban")){
        topic = mes.substring(5).trim();
        unirest.get("https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + topic)
        .header("X-Mashape-Key", authinfo.keys.mashape)
        .header("Accept", "text/plain")
        .end(function (result) {
            if(result.body.list.length !== 0){
                var index = -Math.floor(Math.random() * (0 - result.body.list.length + 1));
                console.log(index);
                msg.channel.sendMessage("**" + result.body.list[index].word + "** by " + result.body.list[index].author + "\n\n" +
                                        result.body.list[index].definition + "\n\n" +
                                        "*" + result.body.list[index].example + "*\n\n" +
                                        ":thumbsup:" + result.body.list[index].thumbs_up +
                                        " : " + ":thumbsdown:" + result.body.list[index].thumbs_down);
            }else{
                msg.channel.sendMessage("No results found :(");
            }
        });
    }

    if(mes.startsWith("leet")){
        var phrase = mes.substring(4);
        unirest.post("https://text-sentiment.p.mashape.com/analyze")
        .header("X-Mashape-Key", authinfo.keys.mashape)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .header("Accept", "application/json")
        .send("text=" + phrase)
        .end(function (result) {
            console.log(result.body);
            msg.channel.sendMessage(result.body);
            console.log("text" + result.body[0]);
            msg.channel.sendMessage("Positive: " + result.body.pos + "Negative: " + result.body.neg_percent + "Mid: " + result.body.mid_percent);
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
        gif (~gif <topic>)\n\
        urban (~urban <topic>)\n\
        echo (~echo <phrase>)\n\
        shorten (~shorten <link>)\n\
        expand (~expand <bit.ly or j.mp link>)\n\
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
