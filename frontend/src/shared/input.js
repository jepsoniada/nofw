import { html } from "/static/shared/templating.js"
import { arrayContains } from "/static/shared/comparisonLib.js"

export class Input extends HTMLElement {

	#value = ''
	set value(value) {
		this.#value = value
		alert(value)
	}
	get value() {
		return this.value
	}

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

	get value() {
		return this.#setups[this.type].valueHandler().get()
	}
	set value(value) {
		this.#setups[this.type].valueHandler().set(value)
	}

	type = ""
	#setups = {
		button: {
			template: _ => `
				<div tabindex=0 class="button">
					<div>
						${this.innerHTML}
					</div>
				</div>
			`,
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
						this.dispatchEvent(new Event("input", {composed: true}))
					}
				})
			},
			valueHandler: _ => ({
				get: _ =>
					this.shadowRoot.querySelector(".button").textContent,
				set: value =>
					this.shadowRoot.querySelector(".button").textContent = value,
			})
		},
		text: {
			template: _ => `
				<div
					contenteditable="plaintext-only"
					spellcheck="false"
					tabindex="0"
					class="text"
				></div>
			`,
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
				function updateCaret () {
					if (text.textContent != "") {
						text.classList.add("inserted")
					} else {
						text.classList.remove("inserted")
					}
				}
				text.addEventListener("input", (pressed) => {
					if (text.textContent.includes('\n')) {
						this.value = text.textContent.replaceAll('\n', '')
						const select = getSelection()
						select.selectAllChildren(text)
						select.collapseToEnd()

						this.dispatchEvent(new Event("send", { composed: true }))
					}
					updateCaret()
				})
			},
			valueHandler: _ => ({
				get: _ => this.shadowRoot.querySelector(".text").textContent,
				set: value => {
					const text = this.shadowRoot.querySelector(".text")
					text.textContent = value
					if (text.textContent != "") {
						text.classList.add("inserted")
					} else {
						text.classList.remove("inserted")
					}
				}
			}),
		},
		checkbox: {
			template: _ => `
				<div class="checkbox" tabindex="0">
					${this.textContent}
					<div class="indicator"></div>
				</div>
			`,
			style: `
				:host > .checkbox {
					background: initial;
					color: initial;
					padding: initial;
				}
				.checkbox {
					display: flex;
					align-items: center;
					gap: 16px;
				}
				.indicator {
					--size: 1em;
					width: var(--size);
					height: var(--size);
					background: #000;
					transition: all .1s ease-in-out;
				}
				.checkbox:focus-visible .indicator {
					scale: 1.5;
				}
				.checked .indicator {
					border-radius: 50%;
				}
			`,
			actions: _ => {
				const box = this.shadowRoot.querySelector(".checkbox")
				this.addEventListener("click", _ => (
					box.classList.toggle("checked"),
					this.dispatchEvent(new Event("input", {composed: true}))
				))
				this.addEventListener("keydown", pressed => {
					if (pressed.key == "Enter") {
						box.classList.toggle("checked")
						this.dispatchEvent(new Event("input", {composed: true}))
					}
				})
			},
			valueHandler: _ => ({
				get: _ =>
					!!this.shadowRoot.querySelector(".checked"),
				set: value =>
					this.shadowRoot.querySelector(".checkbox")
						.classList[value ? "add" : "remove"]("checked"),
			}),
		},
	}
	#types = Object.keys(this.#setups)
}
