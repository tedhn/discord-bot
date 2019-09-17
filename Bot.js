
const Eris = require('eris');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const Lyricist = require('lyricist/node6');
const geniusApi = require('genius-api');
const Giphy = require('giphy');
require('eris-embed-builder');
const fetch = require('node-fetch');
require('dotenv').config();

const bot = new Eris(process.env.ERIS);
const youtube = new YouTube(process.env.YOUTUBE);
const lyricist = new Lyricist(process.env.LYRICIST);
const genius = new geniusApi(process.env.GENIUS);
const giphy = new Giphy(process.env.GIPHY);


let queue = [];
let connections = [];
let joined = false;
let list = [];
let num = 0 ;
let q = "";
let song = "";
let edit = "";
let prefix = "`";
let quiz = [];
let inQuiz = false;
let answered = false;
let correct = 0;
let number = 0;

bot.on("ready" , () =>{
	console.log("Ready");
	bot.editStatus("online" , { name : " your desires" , type : 2 })
})


bot.on("messageCreate", msg => {
		
	let arg = msg.content.split(" ")[0];

		if(msg.member.id !== "509259164137160714"){
			if(arg ===  prefix + "p"){
				song = msg.content.substring(2,msg.content.length);
				handleYoutubeSearch(song, msg.channel); 			
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
			else if ( arg === prefix + "help"){
				msg.channel.createMessage(" %p  to start playing songs \n %q to see the queue \n %l to find the lyrics of the song \n %search to find images / gifs");
			}
		}
});

// handling music //
// working //
function handleP(url , channel , user , vc){
	ytdl.getInfo(url , (err , info)=>{
		let id = info.player_response.videoDetails.videoId;
		let title = info.player_response.videoDetails.title;

		queue.push({name : title , url : "https://www.youtube.com/watch?v=" + id , requested : user})

		if(connections.playing === undefined){
			playMusic(vc,channel);
		}
	});

}

// playing music //
// working //
async function playMusic(vc , channel){

	let embed = channel.createEmbed();

	if(queue.length !== 0){
		if(!joined){
			try{
				bot.joinVoiceChannel(vc).then( connection =>{
					connections =  connection ;
					joined = true;

					playMusic(vc , channel);
				})
			}
			catch(err){
				embed.title("You aren't in a Voice Channel")
				embed.color("16717888")
				embed.send()
			}
		}
		else{
			try{
				let now = queue[0];
				let stream = await ytdl( now.url , {audioonly : true });
						
				
				embed.title("Now playing : **" + now.name + "**" )
				embed.description("Requested by [<@" + now.requested + ">]")
				embed.color("1638205")

				embed.send().then( message =>{
					connections.play(stream)
				})

				connections.once("end" , ()=>{
					if(queue.length >0){
						queue.shift()
						playMusic(vc,channel)
					}
				})
			}
			catch(err){
				console.log(err);
			}
		}
	}
	else{
		connections.stopPlaying()
		embed.title("All songs have been played")
		embed.color("1638205")
		embed.send()
		bot.leaveVoiceChannel(vc)
	}
}


// displaying the song Queue //
// working //
function handleQ(channel){

	let embed = channel.createEmbed();

	try{	
		if(queue.length === 0){
			embed.title("Queue is empty")
			embed.description("Go add some songs :D")
			embed.color("16738690")
			embed.send()
		}
		else{
			queue.map( (q , i )=>{

				if ( joined  && i === 0){
					embed.title("Currently Playing : " + q.name  )
					embed.description("Requested by : [<@ " + queue.requested + ">]")
					embed.color("6946790")
				}
				else{
					embed.field(i + " ) " + q.name, "Requested by [<@" + queue.requested + ">]")
				}
			})
			embed.send();
		}
	}
	catch(err){
		console.log(err);
	}
}

// displaying the lyrics of the song //
// working //
function handleL(title,channel){

	genius.search(title).then( response=>{

		let embed = channel.createEmbed();
		
		embed.title(response.hits[0].result.title_with_featured);
		embed.color("3447003");

		lyricist.song(response.hits[0].result.id , { fetchLyrics: true }).then( data =>{

			let title = "";
			let verse = "";
			let arr = data.lyrics.split("\n");

			for (let i = 0 ; i < arr.length ; i ++){

				
				if(i !== 0 && arr[i].startsWith("[")){
					embed.field(title,verse);
					verse = "";
				}

				if(arr[i].startsWith("[")){
					title = arr[i];
				}
				else{
					verse = verse + "\n" +arr[i]
				}
			}
			embed.send();
		})		
	})
};


// finding songs on youtube //
// working //
async function handleYoutubeSearch(q ,channel){
	
	list = [];

	let embed = channel.createEmbed();

	embed.title("Choose one (1 - 5)");
	embed.color("16761035")

	let result = await youtube.search(q)

	while( list.length < 5 ){
		
		try{				
	    num = list.length + 1 ;
			let title = escapeSpecial(result[list.length].title);
			embed.field(num +") " + title , "Channel : " + result[list.length].channel.title)	
			list.push( {id : result[list.length].id , title : title })

		}
		catch{console.log}
	}

	embed.send().then(msg=>{edit = msg.id});
	
}

// gify search function //
// working //
function handleSearch(q , channel ,i){
	

	giphy.search( { q : q } , (err , response , ress )=>{

		let embed = channel.createEmbed()
		
		embed.color('3447003');
		embed.title(response.data[i].title);
		embed.image(response.data[i].images.original.url); 
		
		embed.send().then(msg =>{

			if(i > 0){
				msg.addReaction("◀").catch(console.log());
			}
			
			msg.addReaction("▶").catch(console.log());

		});
	});
}

// Working  //
function handleEditSongSelection(channel , choice){

	let embed = {
		title : "",
		description : "",
		color : "16761035"
	}
	
	embed.title = "Chosen"; 
	embed.description =  list[choice].title;

	channel.editMessage(edit , {embed} );
}

// working //
async function handleQuiz(channel){
	let embed = {
		title : "Getting Quizes",
		color : " 12648394",
		description : "Answer with \"true\" or \"false\" . Starting in 10 seconds",
	}
	correct = 0;
	number = 0;

	quiz = await getQuiz().catch(console.log);

	channel.createMessage({embed}).then(msg=>{
		edit = msg.id ;
		inQuiz = true ;
	});

	setTimeout( ()=>{
		channel.deleteMessage(edit)
		showQuestion(channel);
	},10000)
	
}

// working //
function showQuestion(channel){
	let embed = channel.createEmbed();
	let j = number + 1; 

	if(number !== 10){
		embed.title("Question " + j)
		embed.color("12648394")
		embed.description( escapeSpecial(quiz[number].Question))

		embed.send()

		let t = setInterval( index =>{
			if ( answered ){	
				number++
				clearInterval(t)
				answered = false;
				showQuestion(channel)
			}
		},1000);
	}
	else{
		inQuiz = false;
		embed.title("End of the quiz")
		embed.color("1609215")
		embed.description("You got " + correct + "/10 right")
		embed.send();
	}
}

// working i guess //
function escapeSpecial(text){
	
	let newText = text;
console.log(newtext)
	newText = newText.replace(/&quot;/g , '\\"' );
	console.log(newtext)
	newText = newText.replace("&#039;" , "\\'" );
	console.log(newtext)
	newText = newText.replace(/&amp;/g , "\\&" );
console.log(newtext)
	return newText;
}

// working //
function handleAnswer(answer , channel){

	let embed = channel.createEmbed();

	if(inQuiz === true){
		if(quiz[number].Answer === answer){
			correct++;
			answered = true;
			embed.title("u rite")
			embed.color("1638205")
		}
		else{
			answered = true;
			embed.title('git gud buddy')
			embed.color("16717888")
		}
		embed.send()
	}
}

// working //
async function getQuiz(){
	url = "https://opentdb.com/api.php?&category=9&type=boolean&amount=10" ;

	let quiz = [];
	

	let response = await fetch(url);
	let json = await response.json();
	try{
		for(var i = 0 ; i <10 ; i++){
			let temp = { Question : "", Answer : "" } ;
		
			temp.Question = json.results[i].question;
			temp.Answer = json.results[i].correct_answer;

			quiz.push(temp);
		}
	
	}catch{console.log};
	return quiz;
}

// song selection //
// working //
bot.on("messageCreate" , msg=>{
	let choice = msg.content;

	if(choice.length === 1){ 
		switch(choice){
			case "1" :
				song = "https://www.youtube.com/watch?v=" + list[0].id ;
				break;
			case "2" :
				song = "https://www.youtube.com/watch?v=" + list[1].id ;
				break;
			case "3" :
				song = "https://www.youtube.com/watch?v=" + list[2].id ;
				break;
			case "4" :
				song = "https://www.youtube.com/watch?v=" + list[3].id ;
				break;
			case "5" :
				song = "https://www.youtube.com/watch?v=" + list[4].id ;
				break;				
		}

		handleEditSongSelection(msg.channel , choice);
		handleP(song , msg.channel , msg.member.id , msg.member.voiceState.channelID);
	}
})

// working //
bot.on("messageCreate" , msg =>{
	let answer = msg.content;

	switch(answer){
		case("true"):
			handleAnswer('True' , msg.channel);
			break;
		case('false'):
			handleAnswer('False' , msg.channel);
			break;
	}

})

bot.connect();	