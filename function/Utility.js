function escapeSpecial(text){
	
	let newText = text;

	newText = newText.replace(/&quot;/g , '\\"' );
	newText = newText.replace("&#039;" , "\\'" );
	newText = newText.replace("&#39;" , "\\'" );
	newText = newText.replace(/&amp;/g , "\\&" );
	return newText;
}

function replaceAt(string , index , replaceWith){
	let newString = string.substring(0,index) + replaceWith + string.substring(index+1 , string.length);
	return newString;
}

module.exports= {escapeSpecial , replaceAt}