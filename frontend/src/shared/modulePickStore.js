import data from "/shared/dictionaryStore.js"
const values = data.getHeaders()
export default {
	values,
	addModule(path) {
		let valueUnderKey = this.values[path[0]] ?? []
		if (valueUnderKey.indexOf(path[1]) == -1) {
			this.values[path[0]] = valueUnderKey.concat(path[1])
		}
	},
	removeModule(path) {
		const indexOfPath = this.values[path[0]].indexOf(path[1])
		this.values[path[0]].splice(
			indexOfPath,
			indexOfPath != -1 ? 1 : 0
		)
		if (this.values[path[0]]?.length < 1) {
			let {[path[0]]: _, ...values} = this.values
			this.values = values
		}
	},
}
