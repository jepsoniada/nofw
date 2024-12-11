import store from  "/static/shared/dictionaryStore.js"
import { default as filtersRef } from "/static/shared/modulePickStore.js"
import { spaMessageListener } from "/static/shared/SPAManager.js"
import { html } from "/static/shared/templating.js"

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
                        <div id="counter">
                          <span id="value">1/${guessStore.length}</span>
                        </div>
			<div class="guess">
				<input- data-type="iconButton" id="back">&lt;</input->
				<div id="content">
					<h3 id="question">${
						question.done ? '' : question.value.question
					}</h3>
					<input- data-type="text" id="guess-input"></input->
					${this.answerStates[this.answered]()}
					${this.nextStates[this.answered]()}
				</div>
			</div>
			<style>
				h3 {
					margin: 0;
				}
				#counter {
				    container-type: inline-size;
					position: absolute;
					font-size: 250px;
					color: #0001;
				    right: 0;
				    @container(min-width: 100vw) {
					* {
					    rotate: 90deg;
					    translate: 100%;
					}
				    }
				}
				#counter #value {
				    display: inline-block;
				    transform-origin: top left;
				    transition: all ease 0.2s;
				}
				#back {
					margin: 0 auto 0 0;
				}
				#next {
					margin: 0 0 0 auto
				}
				.guess {
					position: relative;
					inset: 0;
					display: flex;
					gap: 16px;
					align-items: center;
					flex-direction: column;
				}
				#content {
					width: min-content;
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				.wrong {
					color: #f00;
				}
			</style>
		`
	this.setCounterWidth()
		this.shadowRoot.querySelector("#guess-input").addEventListener("send", _ => {
			this.checkAnswer()
		})
		this.shadowRoot.querySelector("#back").addEventListener("input",
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
			this.shadowRoot.querySelector("#next").addEventListener("input",
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
			`<input- data-type="button" id="next"><span>${
				guessStore.answerCorrectness.length > guessStore.length - 1
					? "finish"
					: "next"
			}</span></input->`,
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
		this.incrementCounter()
		this.answered = false
		const current =
			(this.currentQuestion = this.qaDataIterator.next())
		this.shadowRoot.querySelector("#question").textContent =
			current.value?.question ?? ''
		this.shadowRoot.querySelector("#guess-input").value = ''
	}
	incrementCounter() {
	this.shadowRoot.querySelector("#counter #value").textContent =
			`${guessStore.answerCorrectness.length + 1}/${guessStore.length}`
	this.setCounterWidth()
    }
    setCounterWidth() {
	const counter = this.shadowRoot.querySelector("#counter")
	const value = this.shadowRoot.querySelector("#counter #value")
	counter.style.width = `${value.offsetWidth}px`
	}
	goToResults () {
		this.replaceWith(
			html`<results- id="_"></results->`
		)
	}
}
