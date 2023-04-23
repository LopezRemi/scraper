const express = require("express")
const router = express.Router()
const Ingredient = require("../models/ingredients")
const Recipe = require("../models/recipe")

const IndexController = require("../controllers/index.controller")
const { validate } = require("../middlewares/validators/wrapper.validator")
const { indexValidator } = require("../middlewares/validators/index.validations")

router.get("/", IndexController.index)
router.post("/", validate(indexValidator), IndexController.indexPost)

router.get("/ingredients", async (request, response) => {
    const myIngredients = await Ingredient.find()
    console.log(myIngredients)
    response.json({ data: myIngredients })
})

router.post("/ingredients", async (request, response) => {
    const myIngredients = new Ingredient({ ingredients: "test" })
    await myIngredients.save()
    console.log(myIngredients)
    response.json({ data: myIngredients })
})

router.get("/recipe", async (request, response) => {
    const myRecipe = await Recipe.find()
    console.log(myRecipe)
    response.json({ data: myRecipe })
})

// router.post("/recipe", express.json(), async (request, response) => {
//     const myRecipe = new Recipe(request.body)
//     await myRecipe.save()
//     console.log(myRecipe)
//     response.json({ data: myRecipe })
// })

router.post("/recipe", express.json(), async (request, response) => {
    try {
        const { recipes } = request.body
        const newRecipes = await Recipe.insertMany(recipes)

        response.status(201).json(newRecipes)
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erreur lors de la création des recettes" })
    }
})

router.get("/recipe/:id", async (request, response) => {
    try {
        const { id } = request.params
        const recipe = await Recipe.findById(id)
        if (!recipe) {
            return response.status(404).json({ message: "La recette demandée n'existe pas" })
        }
        response.status(200).json(recipe)
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erreur lors de la récupération de la recette" })
    }
})

router.get("/recipe/title/:title", async (request, response) => {
    try {
        const { title } = request.params
        const recipe = await Recipe.findOne({ title })
        if (!recipe) {
            return response.status(404).json({ message: "La recette demandée n'existe pas" })
        }
        response.status(200).json(recipe)
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erreur lors de la récupération de la recette" })
    }
})

router.get("/recipe/ingredient/:ingredient", async (request, response) => {
    try {
        const { ingredient } = request.params
        const recipes = await Recipe.find({ ingredient: ingredient })
        if (!recipes || recipes.length === 0) {
            return response.status(404).json({
                message: `Aucune recette trouvée avec l'ingrédient ${ingredient}`
            })
        }
        response.status(200).json(recipes)
    } catch (error) {
        console.error(error)
        response.status(500).json({
            message: "Erreur lors de la récupération des recettes"
        })
    }
})

router.get("/recipes", async (request, response) => {
    try {
        const recipes = await Recipe.find({}, "title")
        if (!recipes || recipes.length === 0) {
            return response.status(404).json({
                message: "Aucune recette trouvée"
            })
        }
        const recipeTitles = recipes.map((recipe) => recipe.title)
        response.status(200).json(recipeTitles)
    } catch (error) {
        console.error(error)
        response.status(500).json({
            message: "Erreur lors de la récupération des recettes"
        })
    }
})
module.exports = router
