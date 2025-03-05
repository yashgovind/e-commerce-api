const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

// local strategy
/*use localstrategy on email. find the user by his email. check if user is verified. if yes, return the callback with email,pass. */
passport.use(new LocalStrategy(
    { usernameField: "email" },
    async function (email, password, done) {
        try {
            User.findOne({ email: email }, async function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                const isVerified = await bcrypt.compare(password, user.password);
                if (!isVerified) { return done(null, false); }

                return done(null, user);
            });
        } catch (error) {
            return done(error);
        }
    }
));

// -------GOOGLE STRATEGY--------

/* pass in clientId,clientSecret,clientUrl , return the find the user by his googleID, if user doesnt exist , create a new User googleId return callback.*/
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken,refreshToken, profile, done) =>{
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
  }
));


// serialize and unserialize user../
passport.serializeUser(function (user, cb) {
    console.log('serialized', user.id);
        return cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
    console.log('unserialized', id);
    const user = await User.findById(id);
      return cb(null, user);
});
