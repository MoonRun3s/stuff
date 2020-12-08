const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'info',
    description: 'Info command.',
    guildOnly: false,
    execute(message, args) {
        message.react(config.acceptedEmoji)
        const infoEmbed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle('Information')
            .setDescription('Currently running on ' + config.version)
            .addField('__Language:__', 'JavaScript (node.js)')
            .addField('__Library:__', 'discord.js')
            .addField('__Issues:__', 'No issues logged.')
            .setTimestamp()
            .setFooter(config.version);
    
        message.channel.send(infoEmbed)
    }
};
