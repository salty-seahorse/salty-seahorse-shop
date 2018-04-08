export default function valuesForOption(option) {
    return Object.keys(option.values)
        .map(value => Object.assign(
            { value },
            option.values[value]
        ));
}