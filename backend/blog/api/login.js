// import Cookies from 'cookies'
// import clientPromise from "../../lib/db";
// const {createHash} = require('node:crypto');

// export default async function handler(req, res) {
//   if (req.method == "POST"){
//     const username = req.body['username']
//     const guess = req.body['password']
//     const client = await clientPromise;
//     const db = client.db("Users");
//     const users = await db.collection("Profiles").find({"Username": username}).toArray();
//     if (users.length == 0){
//         res.redirect("/login?msg=Incorrect username or password");
//         return;
//     }
//     const user = users[0]
//     const guess_hash = createHash('sha256').update(guess).digest('hex');
//     if (guess_hash == user.Password){
//         const cookies = new Cookies(req, res)
//         cookies.set('username', username)
//         res.redirect("/")
//     } else {
//         res.redirect("/login?msg=Incorrect username or password")
//     }
//   } else {
//     res.redirect("/")
//   }
// }





import './App.css';
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

  useEffect(() => {
    client.get(baseURL+"/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  // function update_form_btn() {
  //   if (registrationToggle) {
  //     document.getElementById("form_btn").innerHTML = "Register";
  //     setRegistrationToggle(false);
  //   } else {
  //     document.getElementById("form_btn").innerHTML = "Log in";
  //     setRegistrationToggle(true);
  //   }
  // }

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

  function submitLogin(e) {
    e.preventDefault();
    client.post(
      baseURL+"/api/login",
      {
        email: email,
        password: password
      }
    ).then(function(res) {
      setCurrentUser(true);
    });
  }
}