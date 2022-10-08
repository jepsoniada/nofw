import { guessStore } from "/components/guess.js"
import { spaMessageListener } from "/shared/SPAManager.js"
import { html } from "/shared/templating.js"

export class Results extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div class="resluts">
				<button- id="back"><span slot="0">&lt;</span></button->
				<div id="content">
					<div id="score">
						${
							guessStore.answerCorrectness.reduce(
								(acc, answerRes) => acc + Number(answerRes),
								0
							)
						}/${guessStore.length}
					</div>
					<button- id="restart"><span slot="0">restart</span></button->
				</div>
			</div>
			<style>
				#back {
					margin: 0 auto 0 0;
				}
				.resluts {
					display: flex;
					flex-direction: column;
					align-items: center;
				}
			</style>
		`
		this.shadowRoot.querySelector("#back").addEventListener("click",
			_ => spaMessageListener.changeView("/")
		)
		this.shadowRoot.querySelector("#restart").addEventListener("click",
			_ => {
				spaMessageListener.changeView("/guess")
			}
		)
	}
}
