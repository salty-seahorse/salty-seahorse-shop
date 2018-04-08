export default function optionsForItem(item) {
    return Object.keys(item.metadata.options)
        .map(slug => Object.assign(
            { slug },
            item.metadata.options[slug]
        ));
}