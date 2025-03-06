require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../middlewares/auth");
const User = require("../models/userModel");
const router = express.Router();
const { passport, isAuthenticated } = require("../middlewares/auth");

// normal authentication. success --> /profile. failure . /login
router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    })
);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",
    passport.authenticate("google", { successRedirect: "/profile", failureRedirect: "/" })
);

// profile route
router.get("/profile", isAuthenticated, (req, res) => {
    // console.log(req.user);
    // console.log(typeof req.user);
    res.send(`<h1>Welcome, ${req.user.displayName}</h1> <a href='/logout'>Logout</a>`);
});

// logout
router.get("/logout", isAuthenticated, (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

// default route
router.get("/", (req, res) => {
    res.send(`
        <h1>Login Options</h1>
        <form action='/login' method='POST'>
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <button type='submit'>Login</button>
        </form>
        <a href='/auth/google'>Login with Google</a> |
        <h3>New User? Register below:</h3>
        <form action='/register' method='POST'>
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <button type='submit'>Register</button>
        </form>
    `);
});

module.exports = router;