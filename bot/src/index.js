const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const config = require('./config.json')

// command handler

console.log('Command Handler Loading...')

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

function getDirectories() {
	return fs.readdirSync('./commands').filter(function subFolder(file) {
		return fs.statSync('./commands/' + file).isDirectory();
	});
}

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const folder of getDirectories()) {
	const folderFiles = fs.readdirSync('./commands/' + folder).filter(file => file.endsWith('.js'));
	for (const file of folderFiles) {
		commandFiles.push([folder, file]);
	}
}

for (const file of commandFiles) {
	let command;
	if (Array.isArray(file)) {
		command = require(`./commands/${file[0]}/${file[1]}`);
	}
	else {
		command = require(`./commands/${file}`);
	}
	client.commands.set(command.name, command);
}

console.log("Command Handler Loaded...")

// on ready

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	console.log(`--------------------------------`);
	client.user.setActivity("for commands!", { type: "WATCHING" })
});

// eval function

console.log("Eval Function Loading...")

function clean(text) {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}

client.on("message", message => {
	const args = message.content.split(" ").slice(1);

	if (message.content.startsWith(prefix + "eval")) {
		if (message.author.id !== config.ownerID) return;
		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			message.channel.send(clean(evaled), { code: "xl" });
		} catch (err) {
			message.channel.send(`**Eval Error:** \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
});

console.log("Eval Function Loaded...")

// listener

console.log("Message Listener Loading...")

client.on('message', (message) => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('**Command Failure:** Command cannot be executed inside of Direct Messages.');
	}

	if (command.args && !args.length) {
		return message.channel.send('**Command Failure:** Command cannot be executed because argument(s) are missing or invalid.');
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('**Comannd Failure:** Command cannot be executed due to an error.');
	}
});

console.log("Message Listener Loaded...")

console.log(`Logging in...`)
client.login(config.token);
