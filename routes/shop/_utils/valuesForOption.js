export default function valuesForOption(option) {
    return Object.keys(option.values)
        .map(value => Object.assign(
            {
                value,
                disabled: !!option.values[value].outOfStock
            },
            option.values[value]
        ));
}