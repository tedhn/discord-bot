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

const bot = new Eris(process.env.ERIS);
setState(4 , bot);

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
				handleYoutubeSearch( msg.content.substring(2,msg.content.length) , msg.channel); 			
			}
			else if ( arg == prefix + "q"){
				handleQ( msg.channel );
			}
			else if ( arg === prefix + "l"){
				let title = msg.content.substring(2,msg.content.length);
				handleL(title,msg.channel);
			}
			else if( arg === prefix + "search"){
				q = msg.content.split(" ")[1];
				handleSearch( q , msg.channel , num);
			}
			else if ( arg === prefix + "quiz"){
				handleQuiz(msg.channel);
			}
			else if ( arg === prefix + "neko"){
				handleNeko(msg.channel);
			}			
			else if ( arg === prefix + "help"){
				msg.channel.createMessage(" %p  to start playing songs \n %q to see the queue \n %l to find the lyrics of the song \n %search to find images / gifs");
			}
		}
});


bot.on("messageCreate" , msg =>{
	let answer = msg.content;

	switch(answer){
		case("true"):
			handleAnswer('True' , msg.channel , msg.id);
			break;
		case('false'):
			handleAnswer('False' , msg.channel , msg.id);
			break;
	}

})


bot.on("messageCreate" , msg=>{
	let choice = msg.content;
	let song = getState(2);
	let list = getState(3);

	if(choice.length === 1){ 
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