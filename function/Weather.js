const fetch = require('node-fetch');
const {KtoF} = require('./Utility');
const {getState , setState } = require('./State');

let url = 'https://api.openweathermap.org/data/2.5/forecast?zip=93103,us&APPID=' + process.env.OPENWEATHER;


async function handleWeather(msg){
	
	let data = await fetch(url).catch(console.log);
	let json = await data.json();
	setState('weather' , json);
	console.group(json)

	showForecast(msg);
}

async function showForecast(msg){

	let weather = getState('weather');

	let user = msg.member.user;
	let channel = msg.channel;

	let embed = channel.createEmbed();

	embed.title(weather.city.name)
	embed.field('Temprature' ,  KtoF(weather.list[getState('choice')].main.temp) + ' F')
	embed.field('Min Temprature' , KtoF(weather.list[getState('choice')].main.temp_min)  + ' F')
	embed.field('Max Temprature' , KtoF(weather.list[getState('choice')].main.temp_max) + ' F' )

	embed.footer(weather.list[getState('choice')].dt_txt  + " (Requested by " + user.username + " )" , user.avatarURL )


	let kek = await embed.send();
	kek.addReaction('⏪')
	kek.addReaction('⏩')

}

module.exports= { handleWeather , showForecast};