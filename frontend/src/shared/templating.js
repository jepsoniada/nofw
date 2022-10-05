export function html (strs, ...args) {
	const text = strs.reduce((acc, fragment, index) =>
		`${acc}${args[index-1]}${fragment}`
	)
	const template = document.createElement("template")
	template.innerHTML = text.trim()
	if (template.content.children.length > 1) {
		return [...template.content.children]
	}
	return template.content.firstChild
}
