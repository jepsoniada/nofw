import pickStore from "/static/shared/modulePickStore.js"

export default class extends HTMLElement {
	constructor () {
		super()

		const [name, modules] = [this.dataset.name, JSON.parse(this.dataset.modules)]
		if (!name) {
			throw `data-name attribute have no showable content
	Expected: string where string.length > 0
	Got: "${name}"
			`
		}
		if (!modules instanceof Array) {
			throw `data-modules attribute doesn't provide parsable Array
	Expected: object where object instanceof Array
	Got: ${typeof modules}
			`
		}
		if (modules.length < 1) {
			throw `data-modules attribute after parsing is empty
	Expected: Array where Array.length > 0
	Got: ${modules}
			`
		}

		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div>
				<h2>${name}</h2>
				<form>${
					modules.map(a => `
						<label>
							<span class="module-name">${a}</span>
							<input type="checkbox" name="${a}">
						</label>
					`).join('')
				}</form>
			</div>
			<style>
				form {
					display: flex;
					gap: 16px;
					flex-wrap: wrap;
				}
				label {
					user-select: none;
				}
			</style>
		`
		this.shadowRoot.querySelectorAll("form input").forEach(input => {
			const checked = pickStore.values[name]?.indexOf(input.name) ?? -1
			input.checked = checked != -1 ? true : false
			input.addEventListener("change", _ => input.checked
				? pickStore.addModule([name, input.name])
				: pickStore.removeModule([name, input.name])
			)
		})
	}
}
