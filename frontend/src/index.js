import { Guess } from "/static/components/guess.js"
import { DictionaryPicker } from "/static/components/dictionaryPicker.js"
import { SpaView } from "/static/shared/SPAManager.js"
import DictionaryCheckBox from "/static/components/dictionaryCheckBox.js"
import { Results } from "/static/components/results.js"
import Button from "/static/components/button.js"

customElements.define("guess-", Guess)
customElements.define("dictionary-picker-", DictionaryPicker)
customElements.define("spa-view-", SpaView)
customElements.define("check-box-", DictionaryCheckBox)
customElements.define("results-", Results)
customElements.define("button-", Button)

import { Input } from "/static/shared/input.js"
customElements.define("input-", Input)
