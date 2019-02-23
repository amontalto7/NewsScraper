$(document).ready(function() {
  // Grab the articles as a json
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      var articleCard = $("<div>").addClass("card");

      var articleBody = $("<div>").addClass("card-body");
      articleBody.attr("data-id", data[i]._id);

      var aHeadline = $("<h5>").addClass("card-title");
      aHeadline.text(data[i].headline);
      var aUrl = $("<p>").text(data[i].url);
      var aSummary = $("<p>").text(data[i].summary);

      articleBody.append(aHeadline, aUrl, aSummary);

      var notesBtn = $("<a>");
      notesBtn.addClass("btn btn-outline-primary float-left notes-button");
      notesBtn.attr("data-id", data[i]._id);
      notesBtn.text("Notes");
      notesBtn.attr("href", "#");

      // var deleteIcon = $("<i>").addClass("material-icons");
      // deleteIcon.text("delete_forever");

      var deleteBtn = $("<a>");
      deleteBtn.addClass("btn btn-danger float-right align-top delete-this");
      deleteBtn.attr("data-id", data[i]._id);
      deleteBtn.attr("href", "#");
      // deleteBtn.append(deleteIcon);
      deleteBtn.text("X");

      articleBody.append(notesBtn, deleteBtn);

      articleCard.append(articleBody);

      $("#articles").append(articleCard);
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
