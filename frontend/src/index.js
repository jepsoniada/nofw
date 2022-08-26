import Te from "./components/te.js"
import Button from "./components/button.js"

try {

customElements.define("te-", Te)
customElements.define("button-", Button)

} catch (e) {
	alert(e)
}
