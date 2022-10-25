const recipes = require('./recipes.json')
const stocks = require('./stock.json')

function rawInputs(key, amount) {
    let recipe = recipes[key]
    if (!!recipe.raw) {
        return 'RAW'
    }

    let stock = !!stocks[key] ? stocks[key] : 0
    let expectedCrafts = (amount - stock)/(1 + recipe.modifier)

    return Object.keys(recipe.inputs)
        .map(input => ({
            material: input,
            quantity: recipe.inputs[input] * expectedCrafts
        }))
        .map(input => ({
            ...input,
            components: rawInputs(input.material, input.quantity)
        }))
        .reduce((flatMap, input) => {
            if (!flatMap[input.material]) {
                flatMap[input.material] = 0
            }
            flatMap[input.material] += input.quantity

            if (input.components != 'RAW') {
                Object.keys(input.components)
                    .forEach(component => {
                        if (!flatMap[component]) {
                            flatMap[component] = 0
                        }
                        flatMap[component] += input.components[component]
                    })
            }
            return flatMap
        }, {})

}

console.log(rawInputs('lacquered-wood-bow', 7513))