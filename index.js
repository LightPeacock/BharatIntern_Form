const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3002;
const uri = `mongodb+srv://clnarayanan:Traveller2504@bharatintern.jcqihqw.mongodb.net/?retryWrites=true&w=majority&appName=BharatIntern`; // Your MongoDB connection URI

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    // Define registration schema
    const registrationSchema = new mongoose.Schema({
      username: String,
      password: String
    });
    // Create Registration model
    const Registration = mongoose.model("Registration", registrationSchema);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Handling get request
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/pages/index.html");
    });

    // Handling post request
    // Handling post request
app.post("/register", async (req, res) => {
  
    const { username, password } = req.body;
    
    console.log("Received registration request:", { username, password });

    // Check if user already exists
    const existUser = await Registration.findOne({ username: username });
    console.log("Existing user:", existUser);

    if (!existUser) {
      // If user does not exist, create a new registration
      const registrationData = new Registration({
        username,
        password
      });
      console.log("New registration data:", registrationData);

      await registrationData.save();
      console.log("User registered successfully");

      res.redirect("/success");
    } else {
      // If user already exists, display error message
      console.log("User already exists");
      res.redirect("/errore");
    }
  } 
);

app.get("/errore", (req,res) =>{
  res.sendFile(__dirname+"/pages/errore.html")
})

    app.get("/success", (req, res) => {
      res.sendFile(__dirname + "/pages/sucess.html");
    });

    app.get("/error", (req, res) => {
      res.sendFile(__dirname + "/pages/error.html");
    });

    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });
