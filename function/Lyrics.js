
const Lyricist = require('lyricist/node6');
const geniusApi = require('genius-api');

const lyricist = new Lyricist(process.env.LYRICIST);
const genius = new geniusApi(process.env.GENIUS);

module.exports = function handleL(title,channel){

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
