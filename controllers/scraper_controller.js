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
  var pageType = { main: true };
  res.render("index", { pageType });
});

router.get("/saved", function(req, res) {
  // axios isn't calling the local route as defined, so i'm re-creating it by doing another db call instead
  // axios.get("/articles/state/saved")
  //   .then(function(response) {})
  //   .catch(function(error) {
  //   });
  db.Article.find({ saved: true })
    .populate("note")
    .then(function(response) {
      // If any Articles are found, send them to the client
      // construct object to send to handlebars
      var pageType = { main: false };
      var savedData = { pageType, response };
      console.log(savedData);
      res.render("index", savedData);
    })
    .catch(function(error) {
      // If an error occurs, send it back to the client
      console.log(error);
      // res.status(404).send("404 - Section not found");
      let section = { section: req.params.section };
      res.render("404", section);
    });
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

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function(dbArticle) {
      // If any Articles are found, send them to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to update saved state
router.put("/api/articles/:id", function(req, res) {
  //  it finds one article using the req.params.id and runs the populate method with "note",
  // then responds with the article with the note included

  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: req.body.saved })
    .then(function(dbArticle) {
      // If any Articles are found, send them to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for retrieving all Notes from the db
router.get("/api/notes", function(req, res) {
  // Find all Notes
  db.Note.find({})
    .then(function(dbNote) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for retrieving a single notes from the db
router.get("/api/notes/:articleId", function(req, res) {
  // Find all Notes
  db.Article.findOne({ _id: req.params.articleId })
    .populate("note")
    .then(function(dbNotes) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbNotes);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing articles by saved state
router.get("/articles/state/:saved", function(req, res) {
  // if paramater is "saved", set isSaved to true. Everything else gets set to false.
  var isSaved = req.params.saved === "saved" ? true : false;

  db.Article.find({ saved: isSaved })
    .populate("note")
    .then(function(dbArticle) {
      // If any Articles are found, send them to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving a new Note to the db and associating it with an Article
// router.post("/articles/:id", function(req, res) {
router.post("/api/notes", function(req, res) {
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req._headlineId },
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // if the Article was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for deleting a single Article from the db
router.delete("/articles/:id", function(req, res) {
  db.Article.deleteOne({ _id: req.params.id })
    .then(function(dbArticle) {
      // If any Articles are found, send them to the client
      console.log("DELETED-------------------");
      console.log(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for deleting all articles
router.get("/api/clear", function(req, res) {
  db.Article.deleteMany({ saved: false })
    .then(function(dbArticle) {
      // If any Articles are found, send them to the client
      console.log(dbArticle.deletedCount + " unsaved articles deleted");
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
