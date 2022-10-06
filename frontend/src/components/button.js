export default class extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		this.shadowRoot.innerHTML = `
			<div>
				<slot name="0"></slot>
			</div>
			<style>
				div {
					color: #fff;
					background: #000;
					padding: 12px 18px;
				}
				:host {
					display: block;
					width: min-content;
				}
			</style>
		`
	}
}
