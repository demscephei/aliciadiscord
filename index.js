const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const package = require("./package.json");
const fs = require("fs");
var fortunes = [
    "Yes!",
    "No...",
    "Maybe~",
    "Nope!",
    "Yes :)",
    "Not even close",
    "You might as well stop trying.",
    "Sorry, no.",
    "Definitely!",
    "I don't think so.",
    "Ask again, please"
];

bot.on('ready', () => {
    console.log('Alicia-chan is online!');
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "lobby").send("Welcome " + member.toString() + "!");

    member.addRole(member.guild.roles.find("name", "Reploids"));
});

bot.on("guildMemberRemove", function(member){
    member.guild.channels.find("name", "lobby").send("Bye " + member.toString() + "~");
});

bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(config.PREFIX)) return;

    var args = message.content.substring(config.PREFIX.length).split(" ");

    switch (args[0]) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "info":
            message.channel.sendMessage("I'm Alicia v" + package.version + "! A Discord bot created by Dems!");
            break;
        case "8ball":
            if (args[1]) {
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
                break;
            } else {
                message.channel.sendMessage("I need something to tell your fortune.");
                break;
            }
        /*case "embedtest":
            var embed = new Discord.RichEmbed()
                .setDescription("EMBED TEXT")
                .setColor(0x00FFFF)
                .setFooter("Testing footer")
                .setThumbnail(message.author.avatarURL)
            message.channel.sendEmbed(embed);
            break;
        case "mentionme":
            message.channel.sendMessage("Shoutouts to " + message.author.toString() + "!");
            break;
            */
        case "help":
            message.author.sendMessage("Hello " + message.author.toString() + "! I'm here to help you.\
            These are the commands avaible in version" + package.version +  
            "`8ball`\
            `help`\
            `info`\
            `ping`\
            Have a nice day!"
        );
            break;
        case "prefix" :
            if(message.author.id !== config.ownerID){
                message.channel.sendMessage("Sorry! Only my master can use this command.");
                return;
            }
                let newPrefix = message.content.split(" ").slice(1, 2)[0];
                config.prefix = newPrefix;
                fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
                message.channel.sendMessage("Prefix changed!");
                break;
        default:
            if(message.author.id !== config.ownerID){
                message.channel.sendMessage("Um, that's not a valid command...");
                return;
            }
            message.channel.sendMessage("Sorry master! That's not a valid command!");
    }
});

bot.login(config.TOKEN);