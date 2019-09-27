
const state = {
	queue : [],
	joined : false,
	song : '11111111',
	list : [],
	bot : {},
	inQuiz : false,
}

const getState = (key) => {
  return state[key];
};

const setState = (key, val) => {
  state[key] = val;
};

module.exports ={getState,setState};