import { Guess } from "/components/guess.js"
import DictionaryPicker from "/components/dictionaryPicker.js"
import { SpaView } from "/shared/SPAManager.js"
import DictionaryCheckBox from "/components/dictionaryCheckBox.js"
import Button from "/components/button.js"

try {

customElements.define("check-box-", DictionaryCheckBox)
customElements.define("guess-", Guess)
customElements.define("dictionary-picker-", DictionaryPicker)
customElements.define("spa-view-", SpaView)
customElements.define("button-", Button)

} catch(e) {
	alert(e)
}
