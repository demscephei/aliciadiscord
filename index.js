const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = "Mjg5MDA5NDY4Mzk2NTM1ODA4.C6OdbQ.PwcXYs5uj-edd69kAb9dFkGIuBg";
const PREFIX = "=";

var fortunes = [
    "Yes!",
    "No...",
    "Maybe~",
    "Nope!",
    "Yes :)",
    "Not even close",
    "You might as well stop trying.",
];

bot.on('ready', () => {
    console.log('Alicia-chan is online!');
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "lobby").send("Welcome " + member.toString() + "!");

    member.addRole(member.guild.roles.find("name", "Reploids"));
});

bot.on("guildMemberRemove", function(member){
    member.guild.channels.find("name", "lobby").send("Bye-bee " + member.toString() + "...");
});

bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "info":
            message.channel.sendMessage("I'm Alicia v0.1! A Discord bot created by Dems!");
            break;
        case "8ball":
            if (args[1]) {
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
                break;
            } else {
                message.channel.sendMessage("I need something to tell your fortune.");
                break;
            }
        case "embedtest":
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
        default:
            message.channel.sendMessage("Um, that's not a valid command, master...")
    }
});

bot.login(TOKEN);