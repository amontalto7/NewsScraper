/* global bootbox */
// Function to handle article scraping
function scrapeArticles() {
  event.preventDefault();
  var section = $("#section")
    .val()
    .trim();

  console.log($);

  $.ajax({
    method: "GET",
    url: "/scrape/" + section
  }).then(function(data) {
    console.log(data);
    // display css loader
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loader").style.display = "block";
    initPage();
  });
}

function initPage() {
  // Grab the articles as a json
  $.getJSON("/articles/state/unsaved", function(data) {
    // if we have data, display the articles
    $("#articles").empty();
    document.getElementById("loader").style.display = "none";
    document.getElementById("main-content").style.display = "block";

    if (data && data.length) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        var card = $("<div>").addClass("card");

        var saveBtn = $("<a>");
        saveBtn.addClass("btn btn-success mr-5 save");
        saveBtn.text("SAVE ARTICLE");
        saveBtn.attr("href", "#");

        var deleteBtn = $("<a>");
        deleteBtn.addClass("btn btn-danger align-top ml-5 delete-this");
        deleteBtn.attr("data-id", data[i]._id);
        deleteBtn.attr("href", "#");
        deleteBtn.text("X");

        var articleHeader = $(
          "<div class='card-header bg-info text-light'>"
        ).append(
          $("<h5>").append(
            $("<a />", {
              text: data[i].headline,
              rel: "noopener noreferrer",
              href: "https://www.nytimes.com" + data[i].url,
              target: "_blank"
            })
          ),
          saveBtn,
          deleteBtn
        );

        var articleBody = $("<div>").addClass("card-body");
        articleBody.attr("data-id", data[i]._id);

        var aSummary = $("<p>").text(data[i].summary);

        articleHeader.append(deleteBtn);
        articleBody.append(aSummary);

        card.append(articleHeader, articleBody);
        card.data("id", data[i]._id);
        card.data("saved", true);

        $("#articles").append(card);
      }
    } else {
      // Renders some HTML to the page explaining we don't have any articles to view
      // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='card-body text-center' style='background-color: #B4B4A0;'>",
          "<h4><a href='#' class='btnScrape'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      // Appending this data to the page
      $("#articles").append(emptyAlert);
    }
  });
}

// Function to save articles
function handleArticleSave() {
  // This function is triggered when the user wants to save an article
  // When we rendered the article initially, we attached a javascript object containing the headline id
  // to the element using the .data method. Here we retrieve that.
  event.preventDefault();
  var articleToSave = $(this)
    .parents(".card")
    .data();

  console.log(articleToSave);

  // Remove card from page
  $(this)
    .parents(".card")
    .remove();

  // articleToSave.saved = true;
  // Using a patch method to be semantic since this is an update to an existing record in our collection
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + articleToSave.id,
    data: articleToSave
  }).then(function(data) {
    // If the data was saved successfully
    if (data.saved) {
      // Run the initPage function again. This will reload the entire list of articles
      // initPage();
      console.log("article updated");
    }
  });
}

function handleArticleClear() {
  event.preventDefault();
  $.get("api/clear").then(function() {
    $("#articles").empty();
    initPage();
  });
}

function handleArticleNotes(event) {
  // This function handles opening the notes modal and displaying our notes
  // We grab the id of the article to get notes for from the card element the delete button sits inside
  event.preventDefault();
  var currentArticle = $(this)
    .parents(".card")
    .data();

  // Grab any notes with this headline/article id
  $.get("/api/notes/" + currentArticle.id).then(function(data) {
    // Constructing our initial HTML to add to the notes modal
    console.log(data);
    var modalText = $("<div class='container-fluid text-center'>").append(
      $("<h4>").text("Notes For Article: " + currentArticle.id),
      $("<hr>"),
      $("<ul class='list-group note-container'>"),
      $("<textarea placeholder='New Note' rows='4' cols='60'>"),
      $("<button class='btn btn-success saveNote'>Save Note</button>")
    );
    // Adding the formatted HTML to the note modal
    bootbox.dialog({
      message: modalText,
      closeButton: true
    });
    var noteData = {
      _id: currentArticle.id,
      notes: data || []
    };
    // Adding some information about the article and article notes to the save button for easy access
    // When trying to add a new note
    $(".btn.saveNote").data("article", noteData);
    // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
    renderNotesList(noteData);
  });
}

function renderNotesList(data) {
  // This function handles rendering note list items to our notes modal
  // Setting up an array of notes to render after finished
  // Also setting up a currentNote variable to temporarily store each note
  var notesToRender = [];
  var currentNote;
  console.log(data);
  if (!data.notes.notes.length) {
    // If we have no notes, just display a message explaining this
    currentNote = $(
      "<li class='list-group-item'>No notes for this article yet.</li>"
    );
    notesToRender.push(currentNote);
  } else {
    // If we do have notes, go through each one
    for (var i = 0; i < data.notes.notes.length; i++) {
      // Constructs an li element to contain our noteText and a delete button
      currentNote = $("<li class='list-group-item note'>")
        .text(data.notes.notes[i].noteText)
        .append($("<button class='btn btn-danger note-delete'>x</button>"));
      // Store the note id on the delete button for easy access when trying to delete
      currentNote.children("button").data("_id", data.notes.notes[i]._id);
      currentNote.children("button").data("article_id", data._id);
      // Adding our currentNote to the notesToRender array
      notesToRender.push(currentNote);
    }
  }
  // Now append the notesToRender to the note-container inside the note modal
  $(".note-container").append(notesToRender);
}

function handleNoteSave() {
  // This function handles what happens when a user tries to save a new note for an article
  // Setting a variable to hold some formatted data about our note,
  // grabbing the note typed into the input box
  var noteData;
  var newNote = $(".bootbox-body textarea")
    .val()
    .trim();
  // If we actually have data typed into the note input field, format it
  // and post it to the "/api/notes" route and send the formatted noteData as well
  if (newNote) {
    console.log($(this));
    noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
    $.post("/api/notes", noteData).then(function() {
      // When complete, close the modal
      bootbox.hideAll();
    });
  }
}

function deleteThis() {
  event.preventDefault();

  var id = $(this).attr("data-id");

  var thisCard = $(this).parents(".card");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + id
  }).then(function() {
    // Remove card from page
    thisCard.remove();
  });
}

function deleteNote() {
  // var id = $(this).data("_id");
  var currentNote = $(this).data();

  var thisNote = $(this).parents("li.note");

  // alert(currentNote.article_id);

  $.ajax({
    method: "DELETE",
    url: "/notes/" + currentNote._id
  }).then(function() {
    // Remove card from page
    thisNote.remove();
  });
}

// -------------------------------------- MAIN LOGIC ------------------------------- //
$(document).ready(function() {
  // on page load, run the initPage function
  initPage();

  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".btn.unsave", handleArticleSave);
  $(document).on("click", ".btnScrape", scrapeArticles);
  $(document).on("click", ".notes", handleArticleNotes);
  $(document).on("click", ".btn.saveNote", handleNoteSave);
  $(document).on("click", ".btn.note-delete", deleteNote);

  $(".clear").on("click", handleArticleClear);

  // $(document).on("click", ".btnScrape", function() );

  // /articles/state/:saved

  // Click handler for delete buttons
  $(document).on("click", ".delete-this", deleteThis);
});
