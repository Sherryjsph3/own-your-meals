require('dotenv').config();

//========== DEPENDENCIES ==========

const express = require('express');
const port = process.env.PORT || 3000; //if this value (PORT) does not exist then we default to localhost:3000
const methodOverride = require('method-override');
const logger = require('morgan');
const fileUpload = require('express-fileupload');


//========== INITIALIZE EXPRESS ==========

const app = express();


//========== CONFIGURE MONGOOSE ==========

const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
    useFindAndModify: false,
}); 


//========== SET UP SOME LISTENERS ==========

db.on('connected', () => console.log('mongo connected'));
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('disconnected', () => console.log('mongo disconnected'));


//========== HOMEPAGE ROUTE ==========

app.get('/', (req, res) => res.render('homepage.ejs'));

//========== MOUNT MIDDLEWARE ==========

app.use(fileUpload({ createParentPath: true }));//creates req.files
app.use(express.urlencoded({ extended: true}));//creates req.body & has 2b 1st inorder 4 the controller 2 handle the body object
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(logger('dev')); //creates the server log


//========== MOUNT CONTROLLER MIDDLEWARE ==========

const recipesController = require('./controllers/recipes.js');
app.use('/recipes', recipesController);


//========== EXPRESS IS LISTENING ==========

app.listen(port, () => {
    console.log(`Express is listening on port: ${port}`);
})