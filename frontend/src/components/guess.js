import store from  "/shared/dictionaryStore.js"
import { default as filtersRef } from "/shared/modulePickStore.js"
import { spaMessageListener } from "/shared/SPAManager.js"
import { html } from "/shared/templating.js"

export const guessStore = {
	answerCorrectness: [],
}

export class Guess extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.qaDataIterator =
			store.rawQuestionAnswerTouples(
				store.getFilteredValues(
					Object.entries(filtersRef.values)
				)
			)
			[Symbol.iterator]()
		let question = this.qaDataIterator.next()
		this.currentQuestion = question
		try {
		this.shadowRoot.innerHTML = `
			<div class="guess">
				<button- id="back"><span slot="0">&lt;</span></button->
				<div id="content">
					<h3 id="question">${
						question.done ? '' : question.value.question
					}</h3>
					<input id="guess-input">
					<!--
					${this.answerStates[this.answered]}
					${this.nextStates[this.answered]}
					-->
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
			</style>
		`
		} catch(e) {
			alert(e)
		}
		this.shadowRoot.querySelector("#guess-input").addEventListener("keyup", (event) => {
			if (event.key == "Enter") {
				this.checkAnswer()
// 				this.qsDataNext()
			}
		})
		this.shadowRoot.querySelector("#next").addEventListener("click",
			() => this.qsDataNext()
		)
		this.shadowRoot.querySelector("#back").addEventListener("click",
			() => spaMessageListener.changeView("/")
		)
	}
	answered = false
	answerStates = {
		true: () => `<span id="answer">${
			this.currentQuestion.value
		}</span>`,
		false: () => `<span style="display:none" id="answer"></span>`,
	}
	nextStates = {
		true: () =>
			`<button- id="next"><span slot="0">next</span></button->`,
		false: () => `<span style="display:none" id="next"></span>`,
	}
	checkAnswer() {
		this.answered = true
		this.shadowRoot.querySelector("#answer")
			.replaceWith(
				html`${this.answerStates[this.answered]}`
			)
		this.shadowRoot.querySelector("#next")
			.replaceWith(
				html`${this.nextStates[this.answered]}`
			)
	}
	qsDataNext() {
		const current =
			(this.currentQuestion = this.qaDataIterator.next())
		if (current.done) {
// 			some spa view i guess
		}
		this.shadowRoot.querySelector("#question").textContent =
// 			cart.done ? '' : cart.value.question
			current.value?.question ?? ''
		this.shadowRoot.querySelector("#answer").textContent =
// 			cart.done ? '' : cart.value.answer
			current.value?.answer ?? ''
	}
}
