// Here we define constants for our bot such as the client, the config file, the package file where I draw
// some info such as the current version, and some fortune telling for the 8ball command.
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

// Getting ready. Sends a message to the console and sets the bot game to a help text.
bot.on('ready', () => {
    console.log('Alicia-chan is online!');
    bot.user.setGame(`${config.PREFIX}help for commands!`)
});

// Simple welcoming system.
bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "lobby").send("Welcome " + member.toString() + "!");

    member.addRole(member.guild.roles.find("name", "Reploids"));
});

// Wishes a good farewell to leavers.
bot.on("guildMemberRemove", function(member){
    member.guild.channels.find("name", "lobby").send("Bye " + member.toString() + "~");
});

// Here we call the message event. We start the command stuff.
bot.on("message", function(message){
    // We make sure the bot isn't replying to itself or to another bot.
    if (message.author.equals(bot.user)) return;
    // We also make sure the bot stops running this code if the message doesn't start with the prefix we assigned to it.
    // Notice how we are drawing the prefix from config, which is the variable that stores the config.json file location.
    if (!message.content.startsWith(config.PREFIX)) return;
    // Storing in args the arguments as an array. We split by spaces. So if we do =command A B C, the array would be
    // composed of [0] which is =command, [1] which is A, [2] which is B, [3] which is C and so on.
    var args = message.content.substring(config.PREFIX.length).split(" ");
    // We make a switch statement, to test which command will be triggered, since we're looking at args[0],
    // which is the command itself.
    switch (args[0]) {
        // Simple ping command. Replies with "Pong!"
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        // Simple rich embed text info command, still have to figure out how to pull an avatarURL from an ID,
        // since I wanna pull it from config.ownerID, which is my (Dems') ID
        case "info":
            var embed = new Discord.RichEmbed()
                .setDescription("I'm alicia `v" + package.version + "`! A Discord bot created by Dems")
                .setColor(0xD873FF)
                message.channel.sendEmbed(embed);
                break;
            //message.channel.sendMessage("I'm Alicia `v" + package.version + "` ! A Discord bot created by master Dems!");
            //break;
        // Simple 8ball command. Randomly chooses one of the responses declared at the beggining of the code.
        // Also checks whether there's an args[1] or not. And replies accordingly.
            case "8ball":
            if (args[1]) {
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
                break;
            } else {
                // If there's no question or statement.
                message.channel.sendMessage("I need something to tell your fortune.");
                break;
            }
        // Game status changing command. Only ownerID can use it!
        case "game":
            if(message.author.id !== config.ownerID){
                message.channel.sendMessage("Sorry! Only my master can use this command.");
                return;
            }    
            if (args[1]) {
                // If there's an argument after the command, it'll join every subsecuent argument with spaces into
                // one string. (I didn't do this previously so Alicia could only show game names composed of one word
                // or game names that had no spaces such as Half-Life)
                bot.user.setGame(args.slice(1).join(" "));
                break;
            } else {
                // If there's no arguments, it'll set the default text.
                bot.user.setGame(`${config.PREFIX}help for commands!`);
                break;
            }
        // Help command. It'll send to the user who requested it a DM with the necessary information.
        // Notice how we pull the current version from package.json. Pretty neat huh?
         case "help":
            message.author.sendMessage("Hello " + message.author.toString() + "! I'm here to help you. \n" +
            "These are the commands avaible in version `"  + package.version + "` : \n" +  
            "`8ball`\n" +
            "`help`\n" +
            "`info`\n" +
            "`ping`\n" +
            "Have a nice day!"
        );
            break;
        // Command for changing the bot prefix. Useful if I put this bot on another server that has a bot that shares
        // its prefix with Alicia. Only ownerID can use this command!
        case "prefix" :
            if(message.author.id !== config.ownerID){
                message.channel.sendMessage("Sorry! Only my master can use this command.");
                return;
            }
            if (args[1]) {
                // Here we check if there's additional arguments and ignore everything past the first one.
                let newPrefix = message.content.split(" ").slice(1, 2)[0];
                config.PREFIX = newPrefix;
                // New prefix set and Alicia is gonna store it it to the config.json file for future use.
                fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
                message.channel.sendMessage("Prefix changed!");
                break;
            } else {
                // If no prefix is specified, she'll tell you so.
                message.channel.sendMessage("I need you to specify a new prefix, master...");
                break;
            }
        // The default case, triggered if the user doesn't prompts any command from this list. 
        // She'll respond differently if she's talking to ownerID or a regular user!
        default:
            if(message.author.id !== config.ownerID){
                message.channel.sendMessage("Um, that's not a valid command...");
                return;
            }
            message.channel.sendMessage("Sorry master! That's not a valid command!");
            
        // -- JUNK --
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
        // --JUNK --

    }
});

// Bot login. Token pulled from config.json
bot.login(config.TOKEN);