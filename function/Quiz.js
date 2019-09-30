const fetch = require('node-fetch');
const {escapeSpecial , replaceAt} = require('./Utility');
const {getState , setState } = require('./State');


let quiz = [];
let answered = false;
let correct = 0;
let number = 0;
let edit = '';
let progress = '▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱';


async function handleQuiz(msg){
	progress = '▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱ ▱';
	let channel = msg.channel
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
	});

	setState('inQuiz' , true)

	setTimeout( ()=>{
		showQuestion(channel , msg.member.user);
	},5000)
	
	}

function handleAnswer(answer){

	if(getState('inQuiz') === true){
		if(quiz[inQ].Answer === answer){
			correct++;
			progress = replaceAt(progress, number*2 , '▰' )
			answered = true;
		}
		else{
			answered = true;
		}
		
	}
}

async function showQuestion(channel ,user){
	let embed = channel.createEmbed();
	let j = number + 1; 


	if(number !== 10){
		embed.title("Question " + j)
		embed.color("12648394")
		embed.description(escapeSpecial(quiz[number].Question) + '\n')
		embed.field(progress , "Total correct answers : " +  correct);
		embed.footer("Requested by " + user.username , user.avatarURL);

		await channel.deleteMessage(edit).catch(console.log)
		let msg = await embed.send().catch(console.log);
		edit = msg.id;
		msg.addReaction('✅')
		msg.addReaction('❌')

		let t = setInterval( index =>{
			if ( answered ){		
				number++
				clearInterval(t)
				answered = false;
				showQuestion(channel , user)
			}
		},500);
	}
	else{
		setState(5,false)
		embed.title = "End of the quiz" ;
		embed.color = "1609215" ;
		embed.description = "You got " + correct + "/10 right" ;
		channel.deleteMessage(edit)
		channel.createMessage({embed})
	}
}

async function getQuiz(){
	url = "https://opentdb.com/api.php?&category=9&type=boolean&amount=50" ;

	let quiz = [];
	

	let response = await fetch(url);
	let json = await response.json();
	try{
		for(var i = 0 ; i <10 ; i++){
			let rand = Math.floor(Math.random() * 100 / 2);
			let temp = { Question : "", Answer : "" } ;
		
			temp.Question = json.results[rand].question;
			temp.Answer = json.results[rand].correct_answer;

			quiz.push(temp);
		}
	
	}catch{console.log};
	return quiz;
}

module.exports = { handleQuiz , handleAnswer }