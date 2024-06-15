const express=require('express');
const app = express();
const {connectMongoose, User}=require("./database.js")
const ejs = require('ejs');
const passport = require("passport");
const {initialisingPassport, isAuthenticated} =require("./passportConfig.js");
const expressSession = require('express-session')

connectMongoose();

initialisingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(expressSession({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}));    // It provides session management capabilities, allowing you to store session data on the server-side and associate it with clients
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login", (req,res)=>{
    res.render("login")
})


app.post("/register",async (req,res)=>{
    const user = await User.findOne({username:req.body.username});
    if(user) return res.status(400).send("User already exists ")

    const newUser = User.create(req.body);
    res.status(201).send(newUser);
})

app.post("/login",passport.authenticate("local",
{failureRedirect:"/register"
,successRedirect:"/",}),(req,res)=>{

});

app.get("/profile",isAuthenticated, (req,res)=>{
    res.send(req.user);
})

app.get("/logout",(req,res)=>{
    req.logout((err) => {
        if (err) {
            // Handle error
            console.error("Error during logout:", err);
            return res.status(500).send("Error during logout");
        }
        // Logout successful
        res.send("Logged out");
    });
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})

