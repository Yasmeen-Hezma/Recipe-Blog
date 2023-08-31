require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
exports.homePage = async (req, res) => {
    try {
        const categories = await Category.find({}).limit(5);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(5);
        const traditional = await Recipe.find({ 'category': 'Traditional' }).limit(5);
        const modern = await Recipe.find({ 'category': 'Modern' }).limit(5);
        const drinks = await Recipe.find({ 'category': 'Drinks' }).limit(5);
        const food = { latest, traditional, modern, drinks };
        const isAuthenticated = req.isAuthenticated();
        res.render('index', { title: 'Home Page', categories, food, isAuthenticated });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.recipePage = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Recipe Page', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.categoryPage = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const category = await Recipe.find({ 'category': categoryId });
        res.render('category', { title: 'Category Page', category });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.searchPage = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Search Page', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.exploreLatest = async (req, res) => {
    try {
        let recipe = await Recipe.find({}).sort({ _id: -1 }).limit(20);
        res.render('explore-latest', { title: 'Explore Latest', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}
exports.exploreRandom = async (req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('recipe', { title: 'Explore Random', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}
exports.submitRecipe = async (req, res) => {
    try {
        const errorMsgObj = req.flash('errorMsg');
        const successMsgObj = req.flash('successMsg');
        res.render('submit-recipe', { title: 'Submit Recipe', errorMsgObj, successMsgObj });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }

}
exports.submitRecipePost = async (req, res) => {
    try {
        let imageFile;
        let newImageName;
        let imagePath;
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } else {
            imageFile = req.files.image;
            newImageName = Date.now() + imageFile.name;
            imagePath = require('path').resolve('./') + '/public/img/' + newImageName;
            // to move the image to the path
            imageFile.mv(imagePath);
        }
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            ingredients: req.body.ingredients,
            image: newImageName,
            authorId: req.user.id,
        });
        await newRecipe.save();

        req.flash('successMsg', 'Recipe has successfully submitted.')
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('errorMsg', 'An error has occured, please fill all the fields!')
        res.redirect('/submit-recipe');
    }

}
exports.recipeDelete = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).render('error', { title: 'Recipe not found' });
        }
        if (recipe.authorId && req.user && req.user.id === recipe.authorId.toString()) {
            await Recipe.findByIdAndDelete(req.params.id);
            res.json({ redirect: '/' });

        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }
};
exports.recipeEdit = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).render('error', { title: 'Recipe not found' });
        }
        if (recipe.authorId && req.user && req.user.id === recipe.authorId.toString()) {
            res.render('edit-recipe', { title: 'Edit Recipe', recipe });
        } else {
            res.render('unauthorized-edit', { title: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });

    }
}
exports.recipeUpdate = async (req, res) => {
    try {
        let imageFile;
        let newImageName;
        let imagePath;
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } else {
            imageFile = req.files.image;
            newImageName = Date.now() + imageFile.name;
            imagePath = require('path').resolve('./') + '/public/img/' + newImageName;
            imageFile.mv(imagePath);
        }
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).render('error', { title: 'Recipe not found' });
        }
        if (recipe.authorId && req.user && req.user.id === recipe.authorId.toString()) {
            recipe.name = req.body.name;
            recipe.description = req.body.description;
            recipe.category = req.body.category;
            recipe.image = newImageName;
            recipe.ingredients = req.body.ingredients;
            await recipe.save();

            res.redirect('/');
        } else {
            res.status(403).render('error', { title: 'Unauthorized' });
        }

    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};
exports.aboutPage = async (req, res) => {
    try {
        res.render('about', { title: 'About Page' });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.contactPage = async (req, res) => {
    try {
        res.render('contact', { title: 'Contact Page' });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}
exports.loginPage = (req, res) => {
    try {
        res.render('login', { title: 'Login Page' });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
};

exports.loginPagePost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
});

exports.logoutPage = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/');
        })
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
};

exports.registerPage = (req, res) => {
    try {
        res.render('register', { title: 'Register Page' });
    }
    catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
};

exports.registerPagePost = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
};