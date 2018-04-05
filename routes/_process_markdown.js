var yaml = require('yaml-front-matter');

export default function process_markdown(markdown) {
	const yamlFront = yaml.loadFront(markdown);
	const content = yamlFront.__content;

	delete yamlFront.__content;

	return { metadata: yamlFront, content };
}