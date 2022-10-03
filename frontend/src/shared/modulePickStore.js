import data from "/shared/dictionaryStore.js"
const values = data.getHeaders()
export default {
	values,
	addModule(path) {
		if (this.values[path[0]].indexOf(path[1]) == -1) {
			this.values[path[0]].push(path[1])
		}
		console.log(JSON.stringify(this.values))
	},
	removeModule(path) {
		const indexOfPath = this.values[path[0]].indexOf(path[1])
		this.values[path[0]].splice(
			indexOfPath,
			indexOfPath != -1 ? 1 : 0
		)
		console.log(JSON.stringify(this.values))
	},
}
