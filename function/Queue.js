const {getState} = require('./State');

function handleQ(channel){

	let embed = channel.createEmbed();
	
	try{	
		if(getState(0).length === 0){
			embed.title("Queue is empty")
			embed.description("Go add some songs :D")
			embed.color("16738690")
			embed.send()
		}
		else{
			getState(0).map( (q , i )=>{

				if (i === 0){
					embed.title("Currently Playing : " + q.name  )
					embed.description("Requested by : [<@" + q.requested + ">]")
					embed.color("6946790")
				}
				else{
					embed.field(i + " ) " + q.name, "Requested by [<@" + q.requested + ">]")
				}
			})
			embed.send();
		}
	}
	catch(err){
		console.log(err);
	}
}

module.exports = handleQ