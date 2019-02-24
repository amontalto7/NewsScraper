$(document).ready(function() {
  var articleContainer = $("#articles");
  // todo: MAIN LOGIC HERE
});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var articleCard = $("<div>").addClass("card");

    var articleHeader = $("<div>").addClass("card-header  bg-info text-light");

    var articleBody = $("<div>").addClass("card-body");
    articleBody.attr("data-id", data[i]._id);

    var aHeadline = $("<h5>").addClass("card-title");
    aHeadline.text(data[i].headline);
    var aUrl = $("<p>").text(data[i].url);
    var aSummary = $("<p>").text(data[i].summary);

    var saveBtn = $("<a>");
    saveBtn.addClass("btn btn-success float-right mr-5 save");
    saveBtn.attr("data-id", data[i]._id);
    saveBtn.text("SAVE ARTICLE");
    saveBtn.attr("href", "#");

    // var deleteIcon = $("<i>").addClass("material-icons");
    // deleteIcon.text("delete_forever");

    var deleteBtn = $("<a>");
    deleteBtn.addClass("btn btn-danger float-right align-top delete-this");
    deleteBtn.attr("data-id", data[i]._id);
    deleteBtn.attr("href", "#");
    // deleteBtn.append(deleteIcon);
    deleteBtn.text("X");

    articleHeader.append(aHeadline, saveBtn, deleteBtn);
    articleBody.append(aUrl, aSummary);

    articleCard.append(articleHeader, articleBody);

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
