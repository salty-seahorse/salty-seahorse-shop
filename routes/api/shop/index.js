import items from './_items';

const content = JSON.stringify(items);

export function get(req, res) {
    res.set({
        'Content-Type': 'application/json'
    });

    res.end(content);
}