import express from 'express'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken, getIdTokenResult, signOut} from 'firebase/auth'
import { adminAuth } from '../config/database.js'
import { auth, db } from '../firebase.js'
// const express = require('express')
const app = express()
import cors from 'cors'
import { addDoc, collection, getDoc, getDocs, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore'
// const cors = require('cors')
const port = 3000

// const db = require('../config/database')

// const dbLink = db.collection('link')

app.use(cors())
app.use(express.json())     
app.use(express.urlencoded({extended:true}))

app.listen(port, ()=> {
    console.log("udah jalan")
})

// app.get("/get/user", async(req, res)=>{
//     try {
//         let currentUser = auth.currentUser
//         res.send(currentUser)
//     }
//     catch(err){
//         console.log(err)
//     }
// })
app.get("/links", async(req, res)=>{
    const uid = req.query.uid
    try {
        let links = []
        const q = query(collection(db, "link"), where ("UID", "==", uid ));
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
            querySnapshot.forEach((docSnap)=>{
                let id = docSnap.id
                links.push({id, ...docSnap.data()})
            })
            res.send(links)
        })
    }
        catch(err){
            console.log(err)
            res.send(err)
        }
    });
app.post("/user",async(req,res)=>{
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

app.post("/login", async(req, res)=>{
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
            res.send(userCredential.user.id)
            console.log('cek')
        }) 
        
    }
    catch(err)
    {
        res.send(err)
        console.log('error login')
    }
})

app.get("/logout", async(req, res) => {
    try {
        await signOut(auth).then(() => {
            console.log("Berhasil Logout")
            res.send("User Logout")
        })
    }
    catch(err) {
        console.log("Gagal Logout")
        console.log(err)
        res.send("Gagal Logout")
    }
})

app.post("/link", async(req, res) => {
    try {
        await addDoc(collection(db, "link"), {
            oldLink: req.body.oldLink,
            newLink: req.body.newLink,
            UID: req.body.uid,
            viewCount: 0
        })
        console.log("Menambakan Link ke")
        res.send("Menambakan Link")
    }
    catch(err) {
        console.log("Gagal Menambakan Link")
        res.send("Gagal Menambakan Link")
    }
})

app.delete("/:id", async(req, res) => {
    const {id} = req.params
    try {
        await deleteDoc(doc(db, "link", id));
        console.log('sukses')
    }
    catch(err) {
        console.log(err)
        res.send("Gagal")
    }
})