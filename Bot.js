const Eris = require('eris');
require('dotenv').config();
require('eris-embed-builder');

const { handleQuiz , handleAnswer } = require('./function/Quiz');
const { handleYoutubeSearch , handleEditSongSelection , handleP } = require('./function/Music');
const {getState , setState } = require('./function/State');
const handleL = require('./function/Lyrics');
const handleQ = require('./function/Queue');
const handleNeko = require('./function/Neko');
const handleSearch = require('./function/Giphy');
const { handleWeather , showForecast } = require('./function/Weather');

const bot = new Eris(process.env.ERIS);
setState('bot' , bot);

let prefix = "`";
let num = 0 ;

bot.on("ready" , () =>{
	console.log("Ready");
	bot.editStatus("online" , { name : " your desires" , type : 2 })
})


bot.on("messageCreate", msg => {

		
	let arg = msg.content.split(" ")[0];

		if(msg.member.id !== "509259164137160714"){
			if(arg ===  prefix + "p"){
				handleYoutubeSearch( msg.content.substring(2,msg.content.length) , msg.channel)			
			}
			else if ( arg == prefix + "q"){
				handleQ( msg.channel );
			}
			else if ( arg === prefix + "l"){
				let title = msg.content.substring(2,msg.content.length);
				handleL(title,msg.channel)
			}
			else if( arg === prefix + "search"){
				q = msg.content.split(" ")[1];
				handleSearch( q , msg.channel , num)
			}
			else if ( arg === prefix + "quiz"){
				handleQuiz(msg)
			}
			else if ( arg === prefix + "neko"){
				handleNeko(msg.channel)
			}	
			else if ( arg === prefix + "weather"){
				handleWeather(msg)
			}		
			else if ( arg === prefix + "help"){
				msg.channel.createMessage(" %p  to start playing songs \n %q to see the queue \n %l to find the lyrics of the song \n %search to find images / gifs")
			}
		}
});


bot.on("messageReactionAdd" , msg =>{
	let answer = msg.content;
	let choice = getState('choice');

	if(getState('inQuiz')){
		if(Object.keys(msg.reactions).length >= 2){
			if(msg.reactions['✅'].count == 2)
				handleAnswer('True');
			else if(msg.reactions['❌'].count == 2){		
				handleAnswer('False');
			}
		}
	}
	else{
		if(Object.keys(msg.reactions).length >= 2){
			if(msg.reactions['⏪'].count == 2){
				setState('choice' , getState('choice')++)
				showForecast(msg)
			}
			else if(msg.reactions['⏩'].count == 2){
				choice ++
				setState('choice' , choice)
				console.log(getState('choice'))
				showForecast(msg)
			}		
		}
	}
})


bot.on("messageCreate" , msg=>{
	let choice = msg.content;
	let song = getState('song');
	let list = getState('list');

	if(choice.length === '\^\d{9}?$'){ 
		switch(choice){
			case "1" :
				song = "https://www.youtube.com/watch?v=" + list[0].id ;
				break;
			case "2" :
				song  = "https://www.youtube.com/watch?v=" + list[1].id ;
				break;
			case "3" :
				song  = "https://www.youtube.com/watch?v=" + list[2].id ;
				break;
			case "4" :
				song  = "https://www.youtube.com/watch?v=" + list[3].id ;
				break;
			case "5" :
				song  = "https://www.youtube.com/watch?v=" + list[4].id ;
				break;				
		}

		handleEditSongSelection(msg.channel , choice);
		handleP(song , msg.channel , msg.member.id , msg.member.voiceState.channelID);
	}
})



bot.connect();	