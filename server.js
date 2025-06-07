const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

let PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
const { engine } = require("express-handlebars");

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// Import routes and give the server access to them.
const routes = require("./controllers/scraper_controller.js");

app.use(routes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
