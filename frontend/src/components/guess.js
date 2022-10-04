import data from  "/shared/dictionaryStore.js"
import { spaMessageListener } from "/shared/SPAManager.js"

export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<button- id="back"><span slot="0">&lt;</span></button->
			<div>
				<input id="guess">
			</div>
			<style>
				#back {
					width: min-content;
				}
			</style>
		`
		this.shadowRoot.querySelector("#guess").addEventListener("input", () =>
			alert(21)
		)
		this.shadowRoot.querySelector("#back").addEventListener("click", () => 
			spaMessageListener.changeView("/")
		)
	}
}
