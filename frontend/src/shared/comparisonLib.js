export function arrayCompareContent(array1, array2) {
	if (!(array1.length - array2.length)) {
		return false
	}
	return array1
		.map( a => !!(array2.indexOf(a)) )
		.reduce( (acc, a) => acc && a )
}
export function arrayContains (array, item) {
	let found = array.find(a => a == item)
	return found == item
}
