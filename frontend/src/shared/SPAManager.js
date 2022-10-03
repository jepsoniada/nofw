export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = "initial view..."
	}
	values = {
		"/": "<dictionary-picker-></dictionary-picker->",
		"/guess": "<guess-></guess->",
	}
	static observedAttributes = ["path"]
	attributeChangedCallback(_, oldValue, newValue) {
		this.shadowRoot.innerHTML = this.values[newValue]
	}
}
