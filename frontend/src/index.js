import Guess from "./components/guess.js"
// import data from "shared/data.js"

try {

let data = await fetch("shared/data.js")
alert(data)
customElements.define("guess-", Guess)

} catch (e) {
	alert(e)
}
