require('dotenv').config() //para crear archivos encriptados
const express = require('express')
const ejs = require('ejs')
const port = 3000;
const app = express()
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');
const {Schema, model} = mongoose

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true})

const userSchema = new Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = new model('User', userSchema);


app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/register', (req, res) =>{
    res.render('register')
})

app.post('/register', (req, res) => {

    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    .then(() => res.render('secrets'))
    .catch(e => console.error('Add user has failed', + e))

})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}).then(result => {
        if(result.password === password){
            res.render('secrets')
        }else{
            console.log('wrong password')
        }
    }).catch(e => console.log(e))

})



app.listen(port, () => {
    console.log('server connected on port 3000');
})