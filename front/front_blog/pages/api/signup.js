// import Cookies from 'cookies'
// import clientPromise from "../../lib/mongodb";
// const {createHash} = require('node:crypto');

// export default async function handler(req, res) {
//   if (req.method == "POST"){
//     const username = req.body['username']
//     const password = req.body['password']
//     const passwordagain = req.body['passwordagain']
//     if (password != passwordagain){
//         res.redirect("/signup?msg=The two passwords don't match");
//         return;
//     }
//     const client = await clientPromise;
//     const db = client.db("Users");
//     const users = await db.collection("Profiles").find({"Username": username}).toArray();
//     if (users.length > 0){
//         res.redirect("/signup?msg=A user already has this username");
//         return;
//     }
//     const password_hash = createHash('sha256').update(password).digest('hex');
//     const currentDate = new Date().toUTCString();
//     const bodyObject = {
//         Username: username,
//         Password: password_hash,
//         Created: currentDate
//     }
//     await db.collection("Profiles").insertOne(bodyObject);
//     const cookies = new Cookies(req, res)
//     cookies.set('username', username)
//     res.redirect("/")
//   } else {
//     res.redirect("/")
//   }
// }

// import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {

  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



function submitRegistration(e) {
  e.preventDefault();
  client.post(
    baseURL+"/api/register",
    {
      username: username,
      password: password
    }
  ).then(function(res) {
    client.post(
      baseURL+"/api/login",
      {
        email: email,
        password: password
      }
    ).then(function(res) {
      setCurrentUser(true);
    });
  });
}
}