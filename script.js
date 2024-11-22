import * as FrenchVerbs from 'french-verbs';
import * as Lefff from 'french-verbs-lefff/dist/conjugations.json';
const allVerbs = Object.keys(Lefff);
let correct;

function getRandomVerb() {
	// 10% time each, choose aller, vouloir, avoir, etre, pouvoir, devoir and other common french-verbs
	const commonVerbs = ['aller', 'avoir', 'être', 'pouvoir', 'devoir', 'vouloir'];
	if (Math.random() < 0.5) {
		return commonVerbs[Math.floor(Math.random() * commonVerbs.length)];
	}
	return allVerbs[Math.floor(Math.random() * allVerbs.length)];
}

function getRandomSubject() {
	// Person is 1-3 for 1st, 2nd, 3rd person
	const person = Math.floor(Math.random() * 3) + 1;
	const amount = Math.random() < 0.5 ? 'P' : 'S';
	return [person, amount];
}
const submitAnswer = (event) => {
	event.preventDefault();
	let answer = document.getElementById('answer').value;
	if (answer.length === 0) {
		eventHandler();
		return;
	}
	if (answer === correct) {
		document.getElementById('information').innerText = 'Correct!';
		eventHandler();
	} else {
		document.getElementById('information').innerText = 'Wrong! The correct answer is: ' + correct;
	}
	document.getElementById('answer').value = "";
}

function personToString(person) {
	switch (person) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return 'unknown';
	}
}

const eventHandler = () => {
	const tense = document.getElementById('tense').value;
	let [person, amount] = getRandomSubject();
	let verb = getRandomVerb();
	verb = "être";
	amount = "P";
	document.getElementById('information').innerText = `Conjugate ${verb} for ${personToString(person)} person ${amount == 'P' ? 'plural': 'singular'}.`;
	const conjugation = FrenchVerbs.getConjugation(Lefff, verb, tense, person-1, { agreeNumber: amount });
	correct = conjugation;
	document.getElementById('answer').value = "";
}

document.getElementById('tense').addEventListener('input', eventHandler);
document.querySelector('form').addEventListener('submit', submitAnswer);

eventHandler();
	const conjugation = FrenchVerbs.getConjugation(Lefff, 'avoir', 'PRESENT', 1, { agreeNumber: 'P' });
console.log(conjugation);
