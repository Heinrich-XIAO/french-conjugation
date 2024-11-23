import * as FrenchVerbs from 'french-verbs';
import * as Lefff from 'french-verbs-lefff/dist/conjugations.json';
const allVerbs = Object.keys(Lefff);

let progress = JSON.parse(localStorage.getItem('progress')) || {};
let verb;
let correct;

function getRandomVerb() {
	const commonVerbs = ['aller', 'avoir', 'pouvoir', 'devoir', 'vouloir'];
	return commonVerbs[Math.floor(Math.random() * commonVerbs.length)];
	// return allVerbs[Math.floor(Math.random() * allVerbs.length)];
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
		if (progress[verb] === undefined) {
			progress[verb] = {
				total: 1,
				correct: 1
			};
		} else {
			progress[verb]['total']++;
			progress[verb]['correct']++;
		}
		localStorage.setItem('progress', JSON.stringify(progress));
		console.log(progress);
		eventHandler();
	} else {
		document.getElementById('information').innerText = 'Wrong! The correct answer is: ' + correct;
		if (progress[verb] === undefined) {
			progress[verb] = {
				total: 1,
				correct: 0
			};
		} else {
			progress[verb]['total']++;
		}
		localStorage.setItem('progress', JSON.stringify(progress));
		console.log(progress);
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

function subjectToConjugationPerson(person, amount) {
	// Conjugation indicates the person: 0=je, 1=tu, 2=il/elle, 3=nous, 4=vous, 5=ils/elles.
	switch (person) {
		case 1:
			return amount == 'P' ? 3 : 0;
		case 2:
			return amount == 'P' ? 4 : 1;
		case 3:
			return amount == 'P' ? 5 : 2;
	}
}

const subjectToExample = (person, amount) => {
	switch (person) {
		case 1:
			return amount == 'P' ? 'nous' : 'je';
		case 2:
			return amount == 'P' ? 'vous' : 'tu';
		case 3:
			return amount == 'P' ? 'ils' : 'il';
	}
}

const eventHandler = () => {
	const tense = document.getElementById('tense').value;
	const [person, amount] = getRandomSubject();
	verb = getRandomVerb();
	document.getElementById('information').innerText = `Conjugate ${verb} for ${personToString(person)} person ${amount == 'P' ? 'plural': 'singular'} (e.g. ${subjectToExample(person, amount)}).`;
	const conjugation = FrenchVerbs.getConjugation(Lefff, verb, tense, subjectToConjugationPerson(person, amount));
	correct = conjugation;
	document.getElementById('answer').value = "";
}

document.getElementById('tense').addEventListener('input', eventHandler);
document.querySelector('form').addEventListener('submit', submitAnswer);
eventHandler();
