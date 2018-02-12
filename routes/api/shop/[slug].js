import items from './_items';

const lookup = new Map();
items.forEach(item => {
    lookup.set(item.slug, JSON.stringify(item));
});

export function get(req, res, next) {
    const { slug } = req.params;

    if (lookup.has(slug)) {
        res.set({
            'Content-Type': 'application/json'
        });

        res.end(lookup.get(slug));
    } else {
        next();
    }
}