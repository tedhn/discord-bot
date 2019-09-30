const fetch = require('node-fetch');
const {KtoF} = require('./Utility');
const {getState , setState } = require('./State');

let url = 'https://api.openweathermap.org/data/2.5/forecast?zip=93103,us&units=imperial&APPID=' + process.env.OPENWEATHER;


async function handleWeather(msg){
	
	let data = await fetch(url).catch(console.log);
	let json = await data.json();
	setState('weather' , json);

	console.log(json)

	showForecast(msg);
}

async function showForecast(msg){

	let weather = getState('weather');
	let icon = 'http://openweathermap.org/img/w/' + weather.list[getState('choice')].weather[0].icon + '.png';

	let user = msg.member.user;
	let channel = msg.channel;

	let embed = channel.createEmbed();

	console.log(weather.list[getState('choice')].weather)

	embed.color('15532028')
	embed.title(weather.city.name)
	embed.description(weather.city.country)
	embed.thumbnail(icon , {height : 300 , width : 300});
	embed.field(weather.list[getState('choice')].weather[0].main , weather.list[getState('choice')].weather[0].description )
	embed.field('Temprature' ,  weather.list[getState('choice')].main.temp + ' F')
	embed.field('Min Temprature' , weather.list[getState('choice')].main.temp_min  + ' F' ,true)
	embed.field('Max Temprature' , weather.list[getState('choice')].main.temp_max + ' F' ,true)

	embed.footer(weather.list[getState('choice')].dt_txt  + " UTC  (Requested by " + user.username + " )" , user.avatarURL )


	let kek = await embed.send();
	kek.addReaction('⏪')
	kek.addReaction('⏩')

}

module.exports= { handleWeather , showForecast};