import { html } from "/static/shared/templating.js"
import { arrayContains } from "/static/shared/comparisonLib.js"


export class Input extends HTMLElement {
	constructor() {
		super()
		this.type = this.dataset.type ?? "text"
		if (!arrayContains(this.#types, this.type)) {
			throw `input type doesn't exist
	Expected: ${
		this.#types
			.map(type => `"${type}"`)
			.join(" | ")
	}
	Got: "${this.type}"`
		}

		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `${
			this.#setups[this.type].template()
		}`

		this.shadowRoot.append(
			html`<style>
				:host > * {
					padding: 12px 18px;
					background: #000;
				}
				:host > *:focus-visible {
					outline: 0;
				}
				:host {
					color: #fff;
					cursor: pointer;
					display: block;
					width: min-content;
				}
				${this.#setups[this.type].style}
			</style>`
		)

		this.#setups[this.type].actions()
	}
	type = ""
	#setups = {
		button: {
			template: _ => { return `
				<div tabindex=0 class="button">
					<div>
						${this.innerHTML}
					</div>
				</div>
			`},
			style: `
				.button div {
					transition: all ease-in-out 0.1s
				}
				.button:focus-visible div {
					scale: 1.4;
				}
			`,
			actions: _ => {
				this.addEventListener("click", _ =>
					this.dispatchEvent(new Event("input", {composed: true}))
				)
				this.addEventListener("keydown", pressed => {
					if (pressed.key == "Enter") {
						console.log("dispatch on enter")
						this.dispatchEvent(new Event("input", {composed: true}))
					}
				})
			},
		},
		text: {
			template: _ => { return `
				<div contenteditable="plaintext-only" tabindex=0 class="text"></div>
			`},
			style: `
				@keyframes blink {
					0% {
						color: #fff;
					}
					100% {
						color: #888;
					}
				}
				.text {
					min-width: 100px;
					white-space: nowrap;
				}
				.text:before {
					content: "▌";
					position: absolute;
					animation: alternate infinite .5s blink;
				}
				.text:focus-visible:before, .inserted:before {
					display: none;
				}
			`,
			actions: _ => {
				const text = this.shadowRoot.querySelector(".text")
				text.addEventListener("input", function () {
// 					this.classList.toggle("inserted")
					if (this.textContent != "") {
						this.classList.add("inserted")
					} else {
						this.classList.remove("inserted")
					}
				})
				text.addEventListener("keydown", function (pressed) {
					if (pressed.key == "Enter") {
						pressed.preventDefault()
						console.log("sent")
					}
				})
			},
		},
	}
	#types = Object.keys(this.#setups)
}
