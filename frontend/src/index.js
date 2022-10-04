import Guess from "/components/guess.js"
import DictionaryPicker from "/components/dictionaryPicker.js"
import { SpaView } from "/shared/SPAManager.js"
import DictionaryCheckBox from "/components/dictionaryCheckBox.js"
import Button from "/components/button.js"

import { html } from "/shared/templating.js"

customElements.define("check-box-", DictionaryCheckBox)
customElements.define("guess-", Guess)
customElements.define("dictionary-picker-", DictionaryPicker)
customElements.define("spa-view-", SpaView)
customElements.define("button-", Button)


alert(html`<dictionary-picker- id='_'></dictionary-picker->`)
