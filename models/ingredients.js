const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
    {
        ingredients:String
    })
    
    const Ingredient = mongoose.model("ingredients",IngredientSchema);
    module.exports = Ingredient