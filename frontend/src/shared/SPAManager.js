import { arrayContains } from "/shared/comparisonLib.js"

const paths = {
	"/": "<dictionary-picker- id='_'></dictionary-picker->",
	"/guess": "<guess- id='_'></guess->",
}

export const spaMessageListener = new (class {
	#viewToCall = null
	connect (element) {
		if (this.#viewToCall != null) {
			throw `declared more than one "SpaView"`
		}
		this.#viewToCall = element
	}
	disconnect () {
		this.#viewToCall = null
	}
	// TEST ONLY
	exec (callback) {
		callback(this.#viewToCall)
	}
	changeView (viewName) {
		const type = typeof viewName
		if (type != "string") {
			throw `invalid argument type
	Expected: string
	Got: ${type}`
		}
		if (!arrayContains(Object.keys(paths), viewName)) {
			throw `view doesn't exist
	Expected: ${Object.keys(paths)
		.map(path => `"${path}"`)
		.join(" | ")}
	Got: "${viewName}"`
		}
		this.#viewToCall.setAttribute("path", viewName)
	}
})()

export const SpaView = class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<span id="_"></span>
			<style></style>
		`
	}
	static observedAttributes = ["path"]
	attributeChangedCallback(_, oldValue, newValue) {
		const template = document.createElement("template")
		template.innerHTML = paths[newValue]
		this.shadowRoot.removeChild(
			this.shadowRoot.querySelector("#_")
		)
		this.shadowRoot.append(template.content.firstChild)
	}
	disconnectedCallback() {
		spaMessageListener.disconnect()
	}
	connectedCallback() {
		spaMessageListener.connect(this)
	}
}
