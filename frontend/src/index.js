import Guess from "/components/guess.js"
import DictionaryPicker from "/components/dictionaryPicker.js"


try {

customElements.define("guess-", Guess)
customElements.define("dictionary-picker-", DictionaryPicker)


} catch (e) {
	alert(e)
}
