try {

customElements.define("te-",
	class extends HTMLElement {
		constructor () {
			super()
			this.attachShadow({ mode: "open" })
			this.shadowRoot.innerHTML = `
				<div>
					te
				</div>
			`
		}
	}
)

} catch (e) {
	alert(e)
}
