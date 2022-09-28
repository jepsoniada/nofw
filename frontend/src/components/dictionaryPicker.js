import data from  "/shared/dictionaryStore.js"
export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div>
				values<br>
				${
					Object.entries(data)
				}
			</div>
		`
	}
}
