import store from  "/shared/dictionaryStore.js"
import { default as filtersRef } from "/shared/modulePickStore.js"
import { spaMessageListener } from "/shared/SPAManager.js"

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
		this.shadowRoot.innerHTML = `
			<div class="guess">
				<button- id="back"><span slot="0">&lt;</span></button->
				<div id="content">
					<h3 id="question">${
						question.done ? '' : question.value.question
					}</h3>
					<input id="guess-input">
					<!--
						<span id="answer">${
							question.done ? '' : question.value.answer
						}</span>
					-->
					<span style="display:none" id="next"></span>
					<!-- <button- id="next"><span slot="0">next</span></button-> -->
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
		this.shadowRoot.querySelector("#guess-input").addEventListener("keyup", (event) => {
			if (event.key == "Enter") {
				this.qsDataNext()
			}
		})
		this.shadowRoot.querySelector("#back").addEventListener("click", () => 
			spaMessageListener.changeView("/")
		)
	}
	qsDataNext() {
		const cart = this.qaDataIterator.next()
		this.shadowRoot.querySelector("#question").textContent =
			cart.done ? '' : cart.value.question
		this.shadowRoot.querySelector("#answer").textContent =
			cart.done ? '' : cart.value.answer
	}
}
