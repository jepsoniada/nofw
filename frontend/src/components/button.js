export default class extends HTMLElement {
	constructor () {
		super()
		alert("aaaaaaaaaaaaaaaa")
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<input type="button" value="button :)">
		`
	}
}
