const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const escapeSpecial = require('./Utility');
const {getState, setState } = require('./State');

const youtube = new YouTube(process.env.YOUTUBE);

let connections = [];
let edit = "";
let queue = [];

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

	setState('list', list);

	embed.send().then(msg=>{edit = msg.id});
	
}

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

function handleP(url , channel , user , vc){
	ytdl.getInfo(url , (err , info)=>{
		let id = info.player_response.videoDetails.videoId;
		let title = info.player_response.videoDetails.title;

		queue.push({name : title , url : "https://www.youtube.com/watch?v=" + id , requested : user})

		setState('queue' , queue);

		if(connections.playing === undefined){
			playMusic(vc,channel);
		}
	});
}

async function playMusic(vc , channel){

	let embed = channel.createEmbed();
	let joined = getState('joined');

	if(queue.length !== 0){
		if(!joined){
			try{
				getState('bot').joinVoiceChannel(vc).then( connection =>{
					connections =  connection ;
					setState('joined', true )
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
		getState('bot').leaveVoiceChannel(vc)
	}
}

module.exports = {handleYoutubeSearch , handleEditSongSelection , handleP};