import pickStore from "/static/shared/modulePickStore.js"

export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div>
				<h2></h2>
				<form></form>
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
	}
	static observedAttributes = ["data-name", "data-modules", "data-metadata"]
	attributeChangedCallback(name) {
		switch (name) {
			case "data-name": {
				this.shadowRoot.querySelector("h2").innerHTML = this.dataset.name
				break
			}
			case "data-modules": {
				[...this.shadowRoot.querySelector("form").children]
					.forEach((element, index) => { 
						element.querySelector("module-name").textContent =
						JSON.parse(this.dataset.modules)?.[index] ?? element.name
					})
				break
			}
			case "data-metadata": {
				const metadata = JSON.parse(this.dataset.metadata)
				this.shadowRoot.querySelector("form").innerHTML =
					metadata[1].map((module, index) => `
						<label>
							<span class="module-name">
								${
									JSON.parse(this.dataset.modules)?.[index] ?? module
								}
							</span>
							<input type="checkbox" name="${module}">
						</label>
					`).join('')
				Array.from(this.shadowRoot.querySelectorAll("input[type='checkbox']"))
					.forEach(input => {
						let foundInput = pickStore.values[metadata[0]]?.indexOf(input.name) ?? -1
						input.checked = foundInput != -1 ? true : false
						input.addEventListener("change", function (event) {
							this.checked
								? pickStore.addModule([metadata[0], input.name])
								: pickStore.removeModule([metadata[0], input.name])
						})
					})
			}
		}
	}
}
