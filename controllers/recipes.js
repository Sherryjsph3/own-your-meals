
//========== DEPENDENCIES ==========

const express = require('express');
const router = express.Router();
const Recipe =require('../models/recipes.js');
const cloudinary = require('cloudinary').v2


//========== CLOUDINARY CONFIGURATION ==========

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});

//========== SEED ==========

const recipeSeed = require('../models/recipeSeed.js');

router.get('/seed', (req, res) => {
	Recipe.deleteMany({}, (error, allRecipes) => {});

	Recipe.create(recipeSeed, (error, data) => {
		res.redirect('/recipes');
	});
});


//========== INDEX ==========

router.get('/', (req, res) => {
    Recipe.find({}, (error, allRecipes) => {
        res.render('index.ejs', {
            recipes: allRecipes
        });
    });
});


//========== NEW ==========

router.get('/new', (req, res) => {
	res.render('new.ejs');
});


//========== DELETE ==========

router.delete('/:id', (req, res) => {
    Recipe.findByIdAndRemove(req.params.id, (err, removedRecipe) => {
        res.redirect('/recipes');
    });
});


//========== UPDATE ==========

router.put('/:id', (req, res) => {
    Recipe.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        {new: true}, (err, updatedRecipe) => { //new:true returns the updated document
            res.redirect(`/recipes/${req.params.id}`)//will take u to that recipe show page
        })
})


//========== CREATE ==========

router.post('/', (req, res) => {
	const photo = req.files.image
	photo.mv(`./uploads/${photo.name}`);
	cloudinary.uploader.upload(`./uploads/${photo.name}`, function(error, result) {
	req.body.image = result.secure_url;
	Recipe.create(req.body, (err, recipe) => {	
	res.redirect(`/recipes/${recipe._id}`);
	});
});
});


//========== EDIT ==========

router.get('/:id/edit', (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        res.render('edit.ejs', {
            recipe: foundRecipe
        });
    });
});


//========== SHOW ==========

router.get('/:id', (req, res) => {
    Recipe.findById(req.params.id, (err, foundRecipe) => {
        res.render('show.ejs', {recipe: foundRecipe});
    });
}); 

module.exports = router;