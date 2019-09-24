module.exports = function escapeSpecial(text){
	
	let newText = text;

	newText = newText.replace(/&quot;/g , '\\"' );
	newText = newText.replace("&#039;" , "\\'" );
	newText = newText.replace(/&amp;/g , "\\&" );
	return newText;
}
