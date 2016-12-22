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

    if(msg.channel.type === "text"){
        console.log("group message sent in " + msg.channel.guild.name + "\n\"" + msg.content + "\"\n");
    }else if(msg.channel.type === "dm"){
        console.log("private message sent in " + msg.author.username + "\n\"" + msg.content + "\"\n");
    }else{
        return;
    }

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

    if(mes.startsWith("movie")){
        var title = mes.substring(5).trim();
        unirest.get("http://www.omdbapi.com/?t=" + title)
        .end(function(result){
            if(result.body.Response === "True"){
                msg.channel.sendMessage("**" + result.body.Title + "**, " + result.body.Year + "\n" +
                result.body.Genre + "\nDirected by: " + result.body.Director + "\n" +
                "Actors: " + result.body.Actors + "\n" +
                "Plot: " + result.body.Plot + "\n" +
                "Ratings: \n" +
                "\tMetascore: " + result.body.Metascore + "\n" +
                "\tIMDB: " + result.body.imdbRating  + "\n" +
                result.body.Poster);
            }else{
                msg.channel.sendMessage("Movie not found :(");
            }
        });
    }

    if(mes.startsWith("meme")){
        if(mes.substring(4).trim() === "list"){
            msg.channel.sendMessage("List of background meme images:\n"
                                    + "```one does not simply\n"
                                    + "batman slapping robin\n"
                                    + "the most interesting \n"
                                    + "man in the world\n"
                                    + "ancient aliens\n"
                                    + "futurama fry\n"
                                    + "first world problems\n"
                                    + "bad luck brian\n"
                                    + "doge\n"
                                    + "grumpy cat\n"
                                    + "y u no```");
        }else{
            var params = mes.substring(4).split("|");
            if(params.length == 3){
                for (var i = params.length - 1; i >= 0; i--) {
                    params[i] = params[i].trim();
                };
                var img = params[0];
                var templateID
                var matchingID = true;
                switch(img){
                    case "one does not simply":
                        templateID = 61579;
                        break;
                    case "batman slapping robin":
                        templateID = 438680;
                        break;
                    case "the most interesting man in the world":
                        templateID = 61532;
                        break;
                    case "ancient aliens":
                        templateID = 101470;
                        break;
                    case "futurama fry":
                        templateID = 61520;
                        break;
                    case "first world problems":
                        templateID = 61539;
                        break;
                    case "bad luck brian":
                        templateID = 61585;
                        break;
                    case "doge":
                        templateID = 8072285;
                        break;
                    case "grumpy cat":
                        templateID = 405658;
                        break;
                    case "y u no":
                        templateID = 61527;
                        break;
                    default:
                        matchingID = false;
                        break;
                }
                if(matchingID){
                    var formData = {
                        template_id : templateID,
                        username : authinfo.logins.imgflip.username,
                        password : authinfo.logins.imgflip.password,
                        text0 : params[1],
                        text1 : params[2]
                    };
                     
                    request.post("https://api.imgflip.com/caption_image", {
                        form : formData
                    }, function(error, response, body) {
                     
                        var meme = JSON.parse(body);
                     
                        if (!error && response.statusCode == 200) {
                            msg.channel.sendMessage(meme.data.url);
                        }else{
                            msg.channel.sendMessage("Something went wrong.")
                        }
            
                    });
                }else{
                    msg.channel.sendMessage("Image not found. Type ```~meme list``` to see a list of available images.");
                }
            }else{
                msg.channel.sendMessage("Incorrect amount of parameters. Make sure to format it as\n```~meme <image> | <top text> | <bottom text>```");
            }
        }
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

    if(mes === "help"){
        msg.channel.sendMessage("```SilverBot was created by arocks124#9318\n"
            + "to use, type ~ <command>\n" +
            + "Commands:\n"
            + "fat\n"
            + "uptime\n"
            + "rtd\n"
            + "weather (~weather <city>)\n"
            + "gif (~gif <topic>)\n"
            + "urban (~urban <topic>)\n"
            + "echo (~echo <phrase>)\n"
            + "shorten (~shorten <link>)\n"
            + "expand (~expand <bit.ly or j.mp link>)\n"
            + "movie (~movie <title>)\n"
            + "meme (~meme <image> | <top text> | <bottom text>) (type ~meme list for list of available memes)\n"
            + "\n"
            + "Thanks for using SilverBot!```");
    }

    if(mes === "git"){
        msg.channel.sendMessage("GitHub: https://github.com/awarren124/Silver-Bot");
    }
    
});

bot.on("guildMemberAdd", (member) => {
    member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});

bot.on('ready', () => {
    console.log('I am ready!');
    bot.user.setGame("Type ~help for info");
});
bot.login(authinfo.keys.discord);
