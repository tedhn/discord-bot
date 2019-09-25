const fetch = require('node-fetch');
const escapeSpecial = require('./Utility');

let quiz = [];
let inQuiz = false;
let answered = false;
let correct = 0;
let number = 0;
let edit = '';


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
		showQuestion(channel);
	},5000)
	
	},

	handleAnswer : function handleAnswer(answer , channel , id){

	let embed = channel.createEmbed();

	if(inQuiz === true){
		if(quiz[number].Answer === answer){
			correct++;
			answered = true;
		}
		else{
			answered = true;
		}
		}
	}
}



function showQuestion(channel){
	let embed = {
		title : '',
		description : ''
	}
	let j = number + 1; 


	if(number !== 10){
		embed.title = "Question " + j ;
		embed.color = "12648394" ;
		embed.description = escapeSpecial(quiz[number].Question) ;

		channel.editMessage(edit , {embed})

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
		embed.title = "End of the quiz" ;
		embed.color = "1609215" ;
		embed.description = "You got " + correct + "/10 right" ;
		channel.editMessage(edit , {embed})
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