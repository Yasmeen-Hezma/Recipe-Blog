const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const passport = require('passport');
const { ensureAuthenticated } = require('../../config/auth');

router.get('/', recipeController.homePage);
router.get('/recipe/:id', recipeController.recipePage);
router.get('/categories/:id', recipeController.categoryPage);
router.post('/search', recipeController.searchPage);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', ensureAuthenticated, recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipePost);
router.delete('/recipe/:id', ensureAuthenticated, recipeController.recipeDelete);
router.get('/recipe/:id/edit', ensureAuthenticated, recipeController.recipeEdit);
router.post('/recipe/:id/edit', ensureAuthenticated, recipeController.recipeUpdate);
router.get('/about', recipeController.aboutPage);
router.get('/contact', recipeController.contactPage);
router.get('/register', recipeController.registerPage);
router.get('/login', recipeController.loginPage);
router.post('/register', recipeController.registerPagePost);
router.post('/login', recipeController.loginPagePost);
router.get('/logout', recipeController.logoutPage);

module.exports = router;