import store from  "/shared/dictionaryStore.js"
import { default as filtersRef } from "/shared/modulePickStore.js"
import { spaMessageListener } from "/shared/SPAManager.js"
import { html } from "/shared/templating.js"

export const guessStore = {
	answerCorrectness: [],
	length: 0,
	reset() {
		this.answerCorrectness = []
		this.length = 0
		return this
	}
}

export class Guess extends HTMLElement {
	constructor () {
		super()
		guessStore.reset()
		this.attachShadow({ mode: "open" })
		let qaData =
			store.rawQuestionAnswerTouples(
				store.getFilteredValues(
					Object.entries(filtersRef.values)
				)
			)
		guessStore.length = qaData.length
		this.qaDataIterator = qaData[Symbol.iterator]()
		let question = (this.currentQuestion = this.qaDataIterator.next())
		this.shadowRoot.innerHTML = `
			<div class="guess">
				<button- id="back"><span slot="0">&lt;</span></button->
				<div id="content">
					<h3 id="question">${
						question.done ? '' : question.value.question
					}</h3>
					<input id="guess-input">
					${this.answerStates[this.answered]()}
					${this.nextStates[this.answered]()}
				</div>
			</div>
			<style>
				#back {
					margin: 0 auto 0 0;
				}
				#next {
					margin: 0 0 0 auto
				}
				.guess {
					display: flex;
					gap: 16px;
					align-items: center;
					flex-direction: column;
				}
				#content {
					width: min-content;
				}
				.wrong {
					color: #f00;
				}
			</style>
		`
		this.shadowRoot.querySelector("#guess-input").addEventListener("keyup", (event) => {
			if (event.key == "Enter") {
				this.checkAnswer()
			}
		})
		this.shadowRoot.querySelector("#back").addEventListener("click",
			_ => spaMessageListener.changeView("/")
		)
	}
	#answered = false
	get answered () { return this.#answered }
	set answered (value) {
		if (this.answered == value) {
			return
		}
		this.#answered = value
		this.shadowRoot.querySelector("#answer")
			.replaceWith(
				html`${this.answerStates[this.answered]()}`
			)
		this.shadowRoot.querySelector("#next")
			.replaceWith(
				html`${this.nextStates[this.answered]()}`
			)
		if (this.answered) {
			this.shadowRoot.querySelector("#next").addEventListener("click",
				_ => {
					if (guessStore.answerCorrectness.length > guessStore.length - 1) {
						this.goToResults()
						return
					}
					this.qaDataNext()
				}
			)
		}
	}
	answerCorrectnessMaskPerWord = []
	answerStates = {
		true: () => `<span id="answer">${
			this.answerCorrectnessMaskPerWord
				.map((a, index) => {
					let answer = this.currentQuestion.value?.answer.split(' ')
					return `<span ${a ? '' : `class="wrong"`}>${answer[index]}</span>`
				})
				.join(' ')
		}</span>`,
		false: () => `<span style="display:none" id="answer"></span>`,
	}
	nextStates = {
		true: () =>
			`<button- id="next"><span slot="0">${
				guessStore.answerCorrectness.length > guessStore.length - 1
					? "finish"
					: "next"
			}</span></button->`,
		false: () => `<span style="display:none" id="next"></span>`,
	}
	checkAnswer() {
		const value = this.shadowRoot.querySelector("#guess-input").value.split(' ')
		const answer = this.currentQuestion.value?.answer.split(' ') ?? []
		this.answerCorrectnessMaskPerWord = answer
			.map((word, index) => word == value[index])
		const isCorrect = this.answerCorrectnessMaskPerWord.reduce((acc, a) => acc && a)
		guessStore.answerCorrectness.push(isCorrect)
		this.answered = true
	}
	qaDataNext() {
		this.answered = false
		const current =
			(this.currentQuestion = this.qaDataIterator.next())
		this.shadowRoot.querySelector("#question").textContent =
			current.value?.question ?? ''
		this.shadowRoot.querySelector("#guess-input").value = ''
	}
	goToResults () {
		this.replaceWith(
			html`<results- id="_"></results->`
		)
	}
}
