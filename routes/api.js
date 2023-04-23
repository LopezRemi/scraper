const express = require("express")
const router = express.Router()
const Ingredient = require("../models/ingredients")
const Recipe = require("../models/recipe")

const IndexController = require("../controllers/index.controller")
const { validate } = require("../middlewares/validators/wrapper.validator")
const { indexValidator } = require("../middlewares/validators/index.validations")

router.get("/", IndexController.index)
router.post("/", validate(indexValidator), IndexController.indexPost)

router.get("/ingredients", async (request,response)=>{
    const myIngredients = await Ingredient.find()
    console.log(myIngredients)
    response.json({data:myIngredients})})

router.post("/ingredients", async (request,response)=>{
    const myIngredients = new Ingredient({ingredients:"test"})
    await myIngredients.save()
    console.log(myIngredients)
    response.json({data:myIngredients})})    

router.get("/recipe", async (request,response)=>{
    const myRecipe = await Recipe.find()
    console.log(myRecipe)
    response.json({data:myRecipe})})

router.post("/recipe", async (request,response)=>{
    const myRecipe = new Recipe({ 
        titre:"pizza",
        image:"mabite",
        description:"gros",
        preparation:"avec les deux mains"})
        await myRecipe.save()
    console.log(myRecipe)
    response.json({data:myRecipe})})

module.exports = router

