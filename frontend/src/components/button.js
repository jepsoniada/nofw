export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div></div>
			<style>
				div {
					color: #fff;
					background: #000;
					padding: 12px 18px;
				}
			</style>
		`
	}
	static observedAttributes = ["name"]
	attributeChangedCallback(_, __, name) {
		this.shadowRoot.querySelector("div").innerHTML = name
	}
}
