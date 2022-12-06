import express from 'express'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken, getIdTokenResult } from 'firebase/auth'
import { adminAuth } from '../config/database.js'
import { auth, db } from '../firebase.js'
// const express = require('express')
const app = express()
import cors from 'cors'
// const cors = require('cors')
const port = 3000

// const db = require('../config/database')

// const Users = db.collection('users')

app.use(cors())
app.use(express.json())     
app.use(express.urlencoded({extended:true}))

app.listen(port, ()=> {
    console.log("udah jalan")
})

app.get("/get/user", async(req, res)=>{
    try {
        let currentUser = auth.currentUser
        res.send(currentUser)
    }
    catch(err){
        console.log(err)
    }
})
app.post("/post/user",async(req,res)=>{
    let email = req.body.email
    let password = req.body.password
    console.log(email)
    console.log(password)
    try
    {
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            res.send(userCredential)
        }) 
        
    }
    catch(err)
    {
        res.send(err)
        console.log('error regis')
    }
})

app.post("/post/login", async(req, res)=>{
    let email = req.body.email
    let password = req.body.password
    console.log("login", email)
    console.log("login", password)
    try
    {
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            res.send(userCredential.user)
            console.log("login jalan", userCredential.user.uid)
            // document.cookie = userCredential.user.uid
        }) 
        
    }
    catch(err)
    {
        res.send(err)
        console.log('error login')
    }
})