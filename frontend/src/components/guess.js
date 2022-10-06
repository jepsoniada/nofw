import data from  "/shared/dictionaryStore.js"
import { default as filtersRef } from "/shared/modulePickStore.js"
import { spaMessageListener } from "/shared/SPAManager.js"

export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.qaDataIterator =
			data.getFilteredValues(Object.entries(filtersRef.values))[Symbol.iterator]()
		let asdf = this.qaDataIterator.next()
		this.shadowRoot.innerHTML = `
			<div class="guess">
				<button- id="back"><span slot="0">&lt;</span></button->
				<div id="content">
					<h3 id="question">${
						asdf.done ? '' : asdf.value.dictionary[0].data[0].question
					}</h3>
					<input id="guess-input">
					<span id="answer">${
						asdf.done ? '' : asdf.value.dictionary[0].data[0].answer
					}</span>
				</div>
			</div>
			<style>
				#back {
					margin: 0 auto 0 0;
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
			cart.done ? '' : cart.value.dictionary[0].data[0].question
		this.shadowRoot.querySelector("#answer").textContent =
			cart.done ? '' : cart.value.dictionary[0].data[0].answer
	}
}
