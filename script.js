import * as FrenchVerbs from 'french-verbs';
import * as Lefff from 'french-verbs-lefff/dist/conjugations.json';
const allVerbs = Object.keys(Lefff);

let progress = JSON.parse(localStorage.getItem('progress')) || {};
let verb;
let conjugationPerson;
let correct;

function getRandomVerb() {
	const commonVerbs = ['aller', 'avoir', 'pouvoir', 'devoir', 'vouloir'];
	if (Object.keys(progress).length === 0)
		return commonVerbs[Math.floor(Math.random() * commonVerbs.length)];
	// get the verb that has the worst performance
	let worstVerbProgress = Object.values(progress)[0];
	let worstVerb = Object.keys(progress)[0];
	for (let verb in progress) {
		if (progress[verb]['correct']/progress[verb]['total'] < worstVerbProgress['correct']/worstVerbProgress['total']) {
			worstVerbProgress = progress[verb];
			worstVerb = verb;
		}
	}

	return worstVerb;
	// return allVerbs[Math.floor(Math.random() * allVerbs.length)];
}

function getRandomSubject(worstVerb) {
	// get the subject that has the worst performance
	let worstSubjectProgress = Object.values(worstVerb['subjects'])[0];
	let worstSubject = Object.keys(worstVerb['subjects'])[0];
	for (let subject in worstVerb['subjects']) {
		if (worstVerb['subjects'][subject]['correct']/worstVerb['subjects'][subject]['total'] < worstSubjectProgress['correct']/worstSubjectProgress['total']) {
			worstSubjectProgress = worstVerb['subjects'][subject];
			worstSubject = subject;
		}
	}
	return worstSubject;
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
				correct: 1,
				subjects: {
					[conjugationPerson]: {
						total: 1,
						correct: 1
					}
				}
			};
		} else {
			progress[verb]['total']++;
			progress[verb]['correct']++;
			if (progress[verb]['subjects'][conjugationPerson] === undefined) {
				progress[verb]['subjects'][conjugationPerson] = {
					total: 1,
					correct: 1
				};
			}
		}
		localStorage.setItem('progress', JSON.stringify(progress));
		console.log(progress);
		eventHandler();
	} else {
		document.getElementById('information').innerText = 'Wrong! The correct answer is: ' + correct;
		if (progress[verb] === undefined) {
			progress[verb] = {
				total: 1,
				correct: 0,
				subjects: {
					[conjugationPerson]: {
						total: 1,
						correct: 0
					}
				}
			};
		} else {
			progress[verb]['total']++;
			if (progress[verb]['subjects'][conjugationPerson] === undefined) {
				progress[verb]['subjects'][conjugationPerson] = {
					total: 1,
					correct: 0
				};
			}
		}
		localStorage.setItem('progress', JSON.stringify(progress));
		console.log(progress);
	}
	document.getElementById('answer').value = "";
}

function subjectToStringPerson(subject) {
	const mapping = ['1st', '2nd', '3rd', '1st', '2nd', '3rd'];
	return mapping[subject] ?? 'Invalid input';
}

const subjectToExample = (subject) => ['je', 'tu', 'il', 'nous', 'vous', 'ils'][subject] || 'Invalid subject';

const eventHandler = () => {
	const tense = document.getElementById('tense').value;
	verb = getRandomVerb();
	const subject = getRandomSubject(progress[verb]);
	document.getElementById('information').innerText = `Conjugate ${verb} for ${subjectToStringPerson(subject)} person ${subject < 3 ? 'plural': 'singular'} (e.g. ${subjectToExample(subject)}).`;
	console.log(verb, subject, subjectToStringPerson(subject));
	const conjugation = FrenchVerbs.getConjugation(Lefff, verb, tense, subject);
	conjugationPerson = subject;
	correct = conjugation;
	document.getElementById('answer').value = "";
}

document.getElementById('tense').addEventListener('input', eventHandler);
document.querySelector('form').addEventListener('submit', submitAnswer);
eventHandler();
