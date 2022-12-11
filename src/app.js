import express from 'express'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken, getIdTokenResult, signOut} from 'firebase/auth'
import { adminAuth } from '../config/database.js'
import { auth, db } from '../firebase.js'
// const express = require('express')
const app = express()
import cors from 'cors'
import { setDoc, collection, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
// const cors = require('cors')
const port = 3000

// const db = require('../config/database')

// const dbLink = db.collection('link')

app.use(cors())
app.use(express.json())     
app.use(express.urlencoded({extended:true}))

app.listen(port, ()=> {
    console.log("Listening on port ", port)
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

// Get Link by UID
app.get("/links", async(req, res)=>{
    const uid = req.query.uid
    try {
        let links = []
        const q = query(collection(db, "link"), where ("UID", "==", uid ))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((docSnap)=>{
                let id = docSnap.id
                links.push({id, ...docSnap.data()})
        })
        console.log("Get Link")
        res.send(links)
    }
    catch(err){
        console.log(err)
        console.log("Error Get Link")
        res.send(err)
    }
});

// Register
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
            console.log("Register", userCredential)
        }) 
        
    }
    catch(err)
    {
        res.send(err)
        console.log(err)
        console.log('Error Register')
    }
})

//Login
app.post("/login", async(req, res)=>{
    let email = req.body.email
    let password = req.body.password
    try {
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            res.send(userCredential.user)
            console.log("Login ", userCredential.user.uid)
            res.send(userCredential.user.id)
        }) 
        
    }
    catch(err) {
        res.send(err)
        console.log('error login')
    }
})

//Logout
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

// Add Link
app.post("/link", async(req, res) => {
    const linkRef = doc(db, "link", req.body.newLink)
    const docRef = await getDoc(linkRef)
    try {
        if(!docRef.exists()){
            await setDoc(doc(db, "link", req.body.newLink), {
                oldLink: req.body.oldLink,
                newLink: "127.0.0.1:5173/p/" + req.body.newLink,
                UID: req.body.uid,
                viewCount: 0
            })
            console.log("Menambakan Link")
            res.send("Menambakan Link")
        }
        else throw "Custom Link Existed"
    }
    catch(err) {
        console.log("Gagal Menambakan Link")
        console.log(err)
        res.send(err)
    }
})

// Delete Link
app.delete("/:id", async(req, res) => {
    const {id} = req.params
    try {
        await deleteDoc(doc(db, "link", id));
        res.send("Berhasil delete")
        console.log('Berhasil Delete')
    }
    catch(err) {
        console.log("Gagal Delete Link")
        console.log(err)
        res.send("Gagal Delete")
    }
})

// Update Link
app.post("/:id", async(req, res) => {
    const {id} = req.params
    const linkRef = doc(db, "link", req.body.newLink)
    const docRef = await getDoc(linkRef)
    try {
        if(!docRef.exists()){
            await setDoc(doc(db, "link", req.body.newLink), {
                oldLink: req.body.oldLink,
                newLink: "127.0.0.1:5173/p/" + req.body.newLink,
                UID: req.body.uid,
                viewCount: req.body.viewCount,
            })
            console.log("Update Link")
            res.send("Update Link")
        }
        else throw "Custom Link Existed"
    }
    catch(err) {
        console.log("Gagal Update Link")
        console.log(err)
        res.send(err)
    }
})

// Redirect
app.get("/redirect", async(req, res)=>{
    const id = req.query.id
    const linkRef = doc(db, "link", id)
    const docRef = await getDoc(linkRef)
    try {
        if(docRef.exists()) {
            // console.log(docRef.get('oldLink'))
            console.log("Redirect Link To ", docRef.get('oldLink'))
            res.send(docRef.get('oldLink'))
            await updateDoc(linkRef, {
                viewCount: docRef.get('viewCount') + 1
            })
        }

        else throw "Redirect Link Not Existed"
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})