const Neko = require('nekos.life');
const neko = new Neko();


module.export = async function handleNeko(channel){

	let embed = channel.createEmbed();

	let img = await neko.sfw.meow();

	embed.image(img.url)

	embed.send()
}