const fetch = require('node-fetch');
const escapeSpecial = require('./Utility');

let quiz = [];
let inQuiz = false;
let answered = false;
let correct = 0;
let number = 0;

module.exports = { 
	handleQuiz : async function handleQuiz(channel){
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
	
	},

	handleAnswer : function handleAnswer(answer , channel){

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


}
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