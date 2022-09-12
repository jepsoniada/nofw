export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div>
				<input>
			</div>
		`
		this.shadowRoot.querySelector("input").addEventListener("input", () =>
			alert(21)
		)
	}
}
