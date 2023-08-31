const mongoose = require('mongoose');
const User = require('./User');
const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Traditional', 'Modern', 'Drinks', 'Dessert', 'Ramadan'],
        required: true,
    },
    ingredients: {
        type: Array,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})
// To specify the search in terms of name
//db.recipes.createIndex({name: "text" })
recipeSchema.index({ name: 'text' });
module.exports = mongoose.model('Recipe', recipeSchema);

