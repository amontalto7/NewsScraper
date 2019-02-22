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
    notesBtn.addClass("btn btn-outline-primary float-right notes-button");
    notesBtn.attr("data-id", data[i]._id);
    notesBtn.text("Notes");
    notesBtn.attr("href", "#");

    articleBody.append(notesBtn);

    articleCard.append(articleBody);

    $("#articles").append(articleCard);
  }
});

$(document).on("click", ".btnScrape", function() {
  event.preventDefault();
  let section = $("#section")
    .val()
    .trim();

  alert(section);

  console.log($);

  $.ajax({
    method: "GET",
    url: "/scrape/" + section
  }).then(function(data) {
    console.log(data);
  });
});
