export function html (strs, ...args) {
	return strs.reduce((acc, fragment, index) =>
		`${acc}${fragment}${args[index]}`
	)
}
