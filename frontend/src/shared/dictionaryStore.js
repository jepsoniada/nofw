const values = await (await fetch("/api/dictionaries")).json()
const store = {
	values,
	filters: [], // [ "dictionary", ["module"] ]
	getHeaders() {
		return Object.fromEntries(
			this.values
				.map(dictionary => [
					dictionary.fileName,
					dictionary.dictionary.map(
						sub => sub.type
					),
				])
		)
	},
	getFilteredValues(newFilters) {
		this.filters = newFilters ?? this.filters
		const dictNames = this.filters.map(a => a[0])
		const filterMap = Object.fromEntries(this.filters)

		return values
			.filter(dictionary =>
				dictNames.reduce(
					(acc, dictName) => acc || (dictName == dictionary.fileName),
					false
				)
			)
			.map(dictionary => ({
				...dictionary,
				dictionary: dictionary.dictionary
					.filter(module =>
						filterMap[dictionary.fileName].reduce(
							(acc, typeOfModule) => acc || (typeOfModule == module.type),
							false
						)
					)
			}))
	},
	rawQuestionAnswerTouples(from) {
		return from
			.map(dictionary =>
				dictionary.dictionary
					.map(module => module.data)
					.flat()
			)
			.flat()
	},
}
export default store
