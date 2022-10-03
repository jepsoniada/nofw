import Guess from "/components/guess.js"
import DictionaryPicker from "/components/dictionaryPicker.js"
import Spa from "/shared/SPAManager.js"
import DictionaryCheckBox from "/components/dictionaryCheckBox.js"
import Button from "/components/button.js"

customElements.define("check-box-", DictionaryCheckBox)
customElements.define("guess-", Guess)
customElements.define("dictionary-picker-", DictionaryPicker)
customElements.define("spa-view-", Spa)
customElements.define("button-", Button)
