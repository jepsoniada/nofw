import { arrayContains } from "/static/shared/comparisonLib.js"
import { html } from "/static/shared/templating.js"

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
		this.#viewToCall.setAttribute("data-path", viewName)
	}
})()

export const SpaView = class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<span style="display: none" id="_"></span>
			<style></style>
		`
	}
	static observedAttributes = ["data-path"]
	attributeChangedCallback() {
		this.shadowRoot.querySelector("#_")
			.replaceWith(html`${paths[this.dataset.path]}`)
	}
	disconnectedCallback() {
		spaMessageListener.disconnect()
	}
	connectedCallback() {
		spaMessageListener.connect(this)
	}
}
