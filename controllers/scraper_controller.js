const express = require("express");

const router = express.Router();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  res.render("index");
});

// A GET route for scraping the echoJS website
router.get("/scrape/:section", function(req, res) {
  // First, we grab the body of the html with axios;

  axios
    .get("https://www.nytimes.com/section/" + req.params.section + "/")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // console.log(element);
        // Add the text and href of every link, and save them as properties of the result object
        result.headline = $(this)
          .children("a")
          .text();
        result.url = $(this)
          .children("a")
          .attr("href");
        result.summary =
          $(this)
            .parent()
            .children("p")
            .text() || "Summary not found";

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.send("Scrape Complete- " + req.params.section);
    })
    .catch(function(error) {
      console.log(error);
      // res.status(404).send("404 - Section not found");
      let section = { section: req.params.section };
      res.render("404", section);
    });
});

// Export routes for server.js to use.
module.exports = router;
