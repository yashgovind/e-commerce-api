require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../middlewares/auth");
const User = require("../models/userModel");
const router = express.Router();

// register.
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({ email, password: hashedPassword, displayName: email });
        res.send("User registered! <a href='/login'>Login</a>");
    } catch (err) {
        res.send("Error: User already exists!");
    }
});


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

//profile route
router.get("/profile", (req, res) => {
    console.log(req.user);
    console.log(req.user.id);
    // console.log(typeof req.user);
    console.log('user session is ',req.session.passport);
    if (!req.isAuthenticated()) return res.redirect("/");
    res.send(`<h1>Welcome, ${req.user.googleId}</h1> <a href='/logout'>Logout</a>`);
});

// logout
router.get("/logout", (req, res) => {
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