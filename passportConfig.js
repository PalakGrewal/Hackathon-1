const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {User} = require('./database');

exports.initialisingPassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {

        try {   
            const user = await User.findOne({ username });
            // when someone tries to login but user does not exists
            if (!user) return done(null, false);   // done(error, user)

            //  when user exists but password doesn't match
            if (user.password !== password) return done(null, false);
            // const passwordMatch = await bcrypt.compare(password, user.password);
            // if(!passwordMatch) return done(null, false);

            // when password is same
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }

    }
    ));


    //passport.serializeUser(User.serializeUser());
    passport.serializeUser((user,done) =>{ 
        done(null, user.id);  
    })   //it saves the id of user in req.user  (it's saving the user's ID into the session)

    //passport.deserializeUser(User.deserializeUser());
    passport.deserializeUser(async (id,done)=>{
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }) // this function defines how to retrieve the user object from the session 
};

exports.isAuthenticated=(req, res, next)=>{
    if(req.user) return next();
    res.redirect("/login");
}