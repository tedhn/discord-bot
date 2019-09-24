

module.exports = function handleSearch(q , channel ,i){
	

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
