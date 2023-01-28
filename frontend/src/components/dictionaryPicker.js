import data from  "/static/shared/dictionaryStore.js"
import pickStore from "/static/shared/modulePickStore.js"
import { spaMessageListener } from "/static/shared/SPAManager.js"

export class DictionaryPicker extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: "open" })
		const headers = data.getHeaders()
		this.shadowRoot.innerHTML = `
			<div class="picker">
				<div id="list-of-picks">
					${Object.keys(headers).map(name => `
						<check-box-
							data-modules='${JSON.stringify(headers[name])}'
							data-metadata='${JSON.stringify([name, headers[name]])}'
							data-name='${name}'
						></check-box-> 
					`).join('')}
				</div>
				<input- id="start" data-type="button">
					start
				</input->
			</div>
			<style>
				.picker {
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				#start {
					margin: 0 0 0 auto
				}
				.picker {
					background: url("data:image/svg+xml,${
						encodeURIComponent(
							`<svg width='127' height='11' viewBox='0 0 127 11' fill='none' xmlns='http://www.w3.org/2000/svg'>
								<style>
									text {
										font-family: monospace;
									}
								</style>
								<text y='10' fill="#ddd">${this.constructor.name}</text>
							</svg>`
						)
					}");
				}
			</style>
		`
		this.shadowRoot.querySelector("#start").addEventListener("input", _ => {
			spaMessageListener.changeView("/guess")
		})
	}
}
