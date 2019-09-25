const {get , set} = require('../Bot');

let queue = get(1);
let joined = get(2);


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