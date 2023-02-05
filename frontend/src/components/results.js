import { guessStore } from "/static/components/guess.js"
import { spaMessageListener } from "/static/shared/SPAManager.js"
import { html } from "/static/shared/templating.js"

export class Results extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div class="resluts">
				<input- data-type="button" id="back">">&lt;</input->
				<div id="content">
					<div id="score">
						${
							guessStore.answerCorrectness.reduce(
								(acc, answerRes) => acc + Number(answerRes),
								0
							)
						}/${guessStore.length}
					</div>
					<input- data-type="button" id="restart">
						restart
					</input->
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
