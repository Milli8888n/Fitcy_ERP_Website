<script>
import {
	buildMarksTree,
	nestLists,
	isPortableTextListItemBlock,
	isPortableTextBlock,
	isPortableTextToolkitSpan,
	isPortableTextToolkitTextNode,
	isPortableTextToolkitList,
} from '@portabletext/toolkit'
import { defu } from 'defu'
import { h } from 'vue'

// source: https://github.com/portabletext/react-portabletext
const DEFAULT_COMPONENTS = {
	marks: {
		strong: 'strong',
		em: 'em',
		code: 'code',
		link: ({ props, children }) => {
			return h('a', { attrs: { href: props.href, target: '_blank' } }, children)
		},
		default: 'span',
		text: null,
	},
	styles: {
		default: 'div',
		normal: 'p',
		blockquote: 'blockquote',
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		h5: 'h5',
		h6: 'h6',
	},
	list: {
		bullet: 'ul',
		number: 'ol',
	},
	listItem: 'li',
	types: {},
}

function isFunction(value) {
	return value instanceof Function
}

function renderComponent(component, args) {
	if (isFunction(component)) {
		return component(args)
	} else {
		const props = { ...args }

		if (props.children) {
			delete props.children
		}

		if (props.node) {
			delete props.node
		}

		return h(component, props || {}, args.children)
	}
}

function renderBlock(node, components, renderNode) {
	const children = buildMarksTree(node).map((child) => renderNode(child, components, renderNode))

	const { style } = node
	const component = components.styles[style] || components.styles.default

	return renderComponent(component, { node, children })
}

function renderSpan(node, components, renderNode) {
	const children = node.children.map((child) => renderNode(child, components, renderNode))

	const { markType, markDef } = node
	const component = components.marks[markType] || components.marks.default

	return renderComponent(component, { node, props: markDef, children })
}

function renderList(node, components, renderNode) {
	const children = node.children.map((child) => renderNode(child, components, renderNode))

	const component = components.list[node.listItem] || 'ul'
	return renderComponent(component, { node, children })
}

function renderListItem(node, components) {
	const children = buildMarksTree(node).map((child) => renderNode(child, components, renderNode))

	const { style } = node
	const styleComponent = components.styles[style] || components.styles.default

	const listItemComponent = components.listItem

	if (styleComponent === 'p') {
		return renderComponent(listItemComponent, { node, children })
	}

	return renderComponent(listItemComponent, { node, children: [renderComponent(styleComponent, { node, children })] })
}

function renderText(node, components) {
	if (node.text === '\n') {
		return h('br')
	}

	if (components.marks.text) {
		return renderComponent(components.marks.text, { node, children: node.text })
	}

	return node.text
}

function renderCustomType(node, components) {
	const component = components.types[node._type]
	return h(component, { props: node })
}

function renderNode(node, components, renderNode) {
	if (isPortableTextToolkitList(node)) {
		return renderList(node, components, renderNode)
	}

	if (isPortableTextListItemBlock(node)) {
		return renderListItem(node, components, renderNode)
	}

	if (isPortableTextToolkitSpan(node)) {
		return renderSpan(node, components, renderNode)
	}

	if (isPortableTextBlock(node)) {
		return renderBlock(node, components, renderNode)
	}

	if (isPortableTextToolkitTextNode(node)) {
		return renderText(node, components, renderNode)
	}

	if (components.types[node._type]) {
		return renderCustomType(node, components, renderNode)
	}

	console.warn(`[PortableText] No renderer for type "${node._type}"`)
	return
}

function renderPortableText(blocks, components, containerNode) {
	const nested = nestLists(blocks)

	return h(
		containerNode,
		{ attrs: { 'data-portable-text': '' } },
		nested.map((node) => renderNode(node, components, renderNode))
	)
}

export default {
	props: {
		blocks: { type: Array, default: () => [] },
		components: { type: Object, default: () => ({}) },
		as: { type: String, default: 'div' },
	},
	setup(props) {
		const components = defu(props.components, DEFAULT_COMPONENTS)

		return () => renderPortableText(props.blocks, components, props.as)
	},
}
</script>
