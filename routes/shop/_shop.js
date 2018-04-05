import fs from 'fs';
import path from 'path';
import process_markdown from '../_process_markdown.js';
import marked from 'marked';
import hljs from 'highlight.js';

const escaped = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

const unescaped = Object.keys(escaped).reduce(
	(unescaped, key) => ((unescaped[escaped[key]] = key), unescaped),
	{}
);

function unescape(str) {
	return String(str).replace(/&.+?;/g, match => unescaped[match] || match);
}

export default fs
    .readdirSync('content/shop')
    .filter(file => file[0] !== '.' && path.extname(file) === '.md')
    .map(file => {
        const markdown = fs.readFileSync(`content/shop/${file}`, 'utf-8');

        const { content, metadata } = process_markdown(markdown);

        // syntax highlighting
        let uid = 0;
        const highlighted = {};

        const tweaked_content = content.replace(
			/```([\w-]+)?\n([\s\S]+?)```/g,
			(match, lang, code) => {
				const { value } = hljs.highlight(lang, code);
				highlighted[++uid] = value;

				return `@@${uid}`;
			}
		);

		const html = marked(tweaked_content)
			.replace(/<p>@@(\d+)<\/p>/g, (match, id) => {
				return `<pre><code>${highlighted[id]}</code></pre>`;
			})
			.replace(/^\t+/gm, match => match.split('\t').join('  '));

		const subsections = [];
		const pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g;
		let match;

		while ((match = pattern.exec(html))) {
			const slug = match[1];
			// const title = unescape(
			// 	match[2].replace(/<\/?code>/g, '').replace(/\.(\w+)\W.*/, '.$1')
			// );
			const title = unescape(match[2]);

			subsections.push({ slug, title });
		}

		return {
			html,
			metadata,
			subsections,
			slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
			file
        };
	})
	.sort((a, b) => {
		return a.metadata.sortOrder > b.metadata.sortOrder ? 1 : -1	
	})
	.map(item => {
		delete item.metadata.sortOrder;
		
		return item;
	});