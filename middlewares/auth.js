const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

// local strategy
/*use localstrategy on email. find the user by his email. check if user is verified. if yes, return the callback with email,pass. */
// passport.use(new LocalStrategy(
// //     { usernameField: "email" },
// //     async function (email, password, done) {
// //         try {
// //             User.findOne({ email: email }, async function (err, user) {
// //                 if (err) { return done(err); }
// //                 if (!user) { return done(null, false); }
// //                 const isVerified = await bcrypt.compare(password, user.password);
// //                 if (!isVerified) { return done(null, false); }

// //                 return done(null, user);
// //             });
// //         } catch (error) {
// //             return done(error);
// //         }
// //     }
// // ));

// -------GOOGLE STRATEGY--------

/* pass in clientId,clientSecret,clientUrl , return the find the user by his googleID, if user doesnt exist , create a new User googleId return callback.*/


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
    async (accessToken, refreshToken, profile, done) => {
        // console.log('user profile is' ,profile);
    try {
        let user = await User.findOne({ googleId: profile.id} , {displayName:profile.displayName});
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName || profile.name.given_name + ' ' + profile.name.family_name,
            });
        }
        console.log("user after it is created is ", user);
        // user is not being created. somehow.
        return done(null, user);
    } catch (error) {
        return done(error);
    }
  }
));



// serialize and unserialize user../
passport.serializeUser(function (user, cb) {
    // user object is not coming.
    console.log("serialized user is ", user);
    // console.log('serialized', user.id);
        return cb(null, user);
});


passport.deserializeUser(async function (user, cb) {
    // console.log('unserialized', id);
    // const user = await User.findById(id);
    console.log(`the user : ${user}`);
      return cb(null, user);
});


const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/");
    }
    return next();
};

// cannt export passport  directly idk why router error vastundi


module.exports = { passport, isAuthenticated };