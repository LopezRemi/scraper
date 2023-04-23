const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
    {
        ingredients:String,
        main_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'recipe'}],
    })
    
    const Ingredient = mongoose.model("ingredients",IngredientSchema);
    module.exports = Ingredient