const express = require("express")
const router = express.Router()
const Ingredient = require("../models/ingredients")
const Recipe = require("../models/recipe")
const ingredientsData = require("../ingredients.json")

const IndexController = require("../controllers/index.controller")
const { validate } = require("../middlewares/validators/wrapper.validator")
const { indexValidator } = require("../middlewares/validators/index.validations")

router.get("/", IndexController.index)
router.post("/", validate(indexValidator), IndexController.indexPost)

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Operations related to ingredients
 */

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Add ingredients to the databases
 *     description: Save ingredients in the databade
 *     tags:
 *       - Ingredients
 *     requestBody:
 *       description: Array with ingredients names
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: List of ingredients add to the databases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       ingredients:
 *                         type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal serveur error
 */
router.post("/ingredients", async (req, res) => {
    try {
        for (const ingredient of ingredientsData) {
            await Ingredient.create({ ingredients: ingredient })
        }
        res.status(201).send("Ingrédients enregistrés avec succès")
    } catch (error) {
        console.error(error)
        res.status(500).send("Erreur lors de l'enregistrement des ingrédients")
    }
})

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Get all ingredients
 *     description: Retrieve the list of all ingredients
 *     tags:
 *       - Ingredients
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of all ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       ingredients:
 *                         type: string
 */
router.get("/ingredients", async (request, response) => {
    const myIngredients = await Ingredient.find()
    console.log(myIngredients)
    response.json({ data: myIngredients })
})

/**
 * @swagger
 * /ingredients:
 *   delete:
 *     summary: Delete all ingredients from the database
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: All ingredients have been deleted from the database
 *       500:
 *         description: An error occurred while deleting the ingredients
 */
router.delete("/ingredients", async (req, res) => {
    try {
        await Ingredient.deleteMany()
        res.json({ message: "All ingredients have been deleted from the database." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while deleting the ingredients." })
    }
})

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API pour gérer des recettes de cuisine
 *
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - instructions
 *         - duration
 *         - difficulty
 *       properties:
 *         title:
 *           type: string
 *           description: Titre de la recette
 *         description:
 *           type: string
 *           description: Description de la recette
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'ingrédient
 *               quantity:
 *                 type: string
 *                 description: Quantité de l'ingrédient
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *             description: Étape de la recette
 *         duration:
 *           type: string
 *           description: Durée de la recette
 *         difficulty:
 *           type: string
 *           description: Difficulté de la recette
 *       example:
 *         title: Recette de pâtes à la carbonara
 *         description: Une recette simple de pâtes à la carbonara
 *         ingredients:
 *           - name: Pâtes
 *             quantity: 250g
 *           - name: Lardons
 *             quantity: 100g
 *           - name: Oeufs
 *             quantity: 2
 *           - name: Parmesan
 *             quantity: 50g
 *         instructions:
 *           - Faire cuire les pâtes dans de l'eau bouillante salée.
 *           - Pendant ce temps, faire revenir les lardons dans une poêle.
 *           - Battre les œufs dans un bol, ajouter le parmesan et poivrer.
 *           - Égoutter les pâtes et les mélanger avec les lardons.
 *           - Ajouter le mélange œufs/parmesan sur les pâtes, mélanger rapidement et servir.
 *         duration: 30 minutes
 *         difficulty: Facile
 *
 * /recipe:
 *   post:
 *     summary: Ajouter une ou plusieurs recettes
 *     tags: [Recipes]
 *     requestBody:
 *       description: Liste de recettes à ajouter
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Recipe'
 *     responses:
 *       '201':
 *         description: Recettes créées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       '500':
 *         description: Erreur lors de la création des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *                   example: Erreur lors de la création des recettes
 */
router.post("/recipes", async (req, res) => {
    try {
        const recipesData = require("../recipes.json")
        const recipes = recipesData.map((recipeData) => new Recipe(recipeData))

        const createdRecipes = await Recipe.insertMany(recipes)
        res.status(201).json(createdRecipes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

/**
 * @swagger
 * /recipe:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: An array of all the recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/recipe", async (request, response) => {
    const myRecipe = await Recipe.find()
    console.log(myRecipe)
    response.json({ data: myRecipe })
})

/**
 * @swagger
 * /recipe/{id}:
 *   get:
 *     summary: Retrieve a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to retrieve
 *     responses:
 *       200:
 *         description: A single recipe object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *
 *   components:
 *     schemas:
 *       Recipe:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           ingredients:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: string
 *               required:
 *                 - name
 *                 - quantity
 *             required:
 *               - name
 *               - quantity
 *           steps:
 *             type: array
 *             items:
 *               type: string
 *             required: true
 */

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

/**
 * @swagger
 * /recipe/title/{title}:
 *   get:
 *     summary: Récupère une recette par titre
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Titre de la recette
 *     responses:
 *       200:
 *         description: La recette récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: La recette n'a pas été trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *       500:
 *         description: Erreur lors de la récupération de la recette
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 */
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

/**
 * @swagger
 *
 * /recipe/ingredient/{ingredient}:
 *   get:
 *     summary: Récupérer les recettes contenant un ingrédient spécifique
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: ingredient
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ingrédient pour lequel on souhaite récupérer les recettes
 *     responses:
 *       200:
 *         description: Les recettes contenant l'ingrédient spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Aucune recette trouvée avec l'ingrédient spécifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aucune recette trouvée avec l'ingrédient 'poulet'
 *       500:
 *         description: Une erreur s'est produite lors de la récupération des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des recettes
 */

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

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API pour gérer des recettes de cuisine
 *
 * /recipes:
 *   get:
 *     summary: Récupère les titres de toutes les recettes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des titres des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: Aucune recette trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */

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

/**
 * Supprimer tous les documents de la collection "recipes".
 * @swagger
 * /recipes:
 *   delete:
 *     summary: Supprimer tous les documents de la collection "recipes".
 *     tags: [Recipes]
 *     responses:
 *       '200':
 *         description: Tous les documents de la collection "recipes" ont été supprimés.
 *       '500':
 *         description: Erreur lors de la suppression des documents de la collection "recipes".
 */

router.delete("/recipes", async (req, res) => {
    try {
        await Recipe.deleteMany()
        res.status(200).send('Tous les documents de la collection "recipes" ont été supprimés.')
    } catch (err) {
        console.error(err)
        res.status(500).send('Erreur lors de la suppression des documents de la collection "recipes".')
    }
})

module.exports = router
