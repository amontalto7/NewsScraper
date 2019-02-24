$(document).ready(function() {
  $(document).on("click", ".btn.save", handleArticleSave);
  // $(document).on("click", ".btnScrape", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  // /articles/state/:saved
  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    event.preventDefault();
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/articles/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        // initPage();
        console.log("article saved");
      }
    });
  }

  function handleArticleClear() {
    event.preventDefault();
    $.get("api/clear").then(function() {
      $("#articles").empty();
      // initPage();
    });
  }

  // Grab the articles as a json
  $.getJSON("/articles/state/unsaved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      var card = $("<div>").addClass("card");

      var saveBtn = $("<a>");
      saveBtn.addClass("btn btn-success mr-5 save");
      saveBtn.attr("data-id", data[i]._id);
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
      card.data("_id", data[i]._id);

      $("#articles").append(card);
    }
  });

  $(document).on("click", ".btnScrape", function() {
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
    });
  });

  // Click handler for delete buttons
  $(document).on("click", ".delete-this", function() {
    event.preventDefault();

    var id = $(this).attr("data-id");

    $.ajax({
      method: "DELETE",
      url: "/articles/" + id
    }).then(function(data) {
      console.log(data);
      // TODO: Refresh articles on page
    });
  });
});
