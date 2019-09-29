const fetch = require('node-fetch');
const {KtoF} = require('./Utility');
const {getState , setState } = require('./State');

let url = 'https://api.openweathermap.org/data/2.5/forecast?zip=93103,us&APPID=' + process.env.OPENWEATHER;


async function handleWeather(msg){

//	let data = await fetch(url).catch(console.log);
//	let json = await data.json();

  console.log(getState(1))

//	showForecast(msg , json);
}

function showForecast(msg , json){

	let user = msg.member.user;
	let channel = msg.channel;

	let embed = channel.createEmbed();

	

	embed.title(json.city.name)
	embed.field('Temprature' ,  KtoF(json.list[getState(6)].main.temp) + 'F')
	embed.field('Min Temprature' , KtoF(json.list[getState(6)].main.temp_min)  + 'K')
	embed.field('Max Temprature' , KtoF(json.list[getState(6)].main.temp_max) + 'K' )

	embed.footer(json.list[1].dt_txt  + " (Requested by " + user.username + " )" , user.avatarURL )


	embed.send()
}

module.exports= handleWeather;