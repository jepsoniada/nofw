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
					--outline: 0.2em;
					outline: var(--outline) solid #000;
					outline-offset: calc(-1 * var(--outline));
					border-radius: .6em;
				}
				:host > *:focus-visible {
					outline: 0;
				}
				:host {
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
				.button {
					padding: .8em 1em;
				}
				.button div {
					position: relative;
					top: 1px;
					transition: all ease-in-out 0.1s;
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
	iconButton: {
	    template: _ => `
				<div tabindex=0 class="button">
					<div>
						${this.innerHTML}
					</div>
				</div>
			`,
	    style: `
                .button {
			height: 2.6em;
			width: 2.6em;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.button div {
			position: relative;
			top: 1px;
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
					outline: none;
					background: #000;
					padding: .8em 1em;
					color: #fff;
					min-width: 100px;
					white-space: nowrap;
					transition: all ease-in-out 0.1s;
				}
				.text:before {
					content: "▌";
					position: absolute;
					animation: alternate infinite .5s blink;
				}
				.text:focus-visible {
					border-radius: 0;
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
				.checkbox {
					outline: none;
					background: initial;
					color: initial;
					padding: initial;
					display: flex;
					align-items: center;
					gap: 16px;
				}
				.indicator {
					--size: .9em;
					--outline: .2em;
					width: var(--size);
					height: var(--size);
					outline: var(--outline) solid #000;
					outline-offset: calc(-1 * var(--outline));
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
