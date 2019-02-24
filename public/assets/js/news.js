$(document).ready(function() {
  // $(document).on("click", ".btn.save", handleArticleSave);
  // $(document).on("click", ".btnScrape", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function handleArticleClear() {
    event.preventDefault();
    $.get("api/clear").then(function() {
      $("#articles").empty();
      // initPage();
    });
  }

  // Grab the articles as a json
  $.getJSON("/articles", function(data) {
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
      // deleteBtn.append(deleteIcon);
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

      // var aHeadline = $("<h5>").addClass("card-title");
      // var aHeadLineURL = $("<a />", {
      //   text: data[i].headline,
      //   title: data[i].headline,
      //   href: "https://www.nytimes.com" + data[i].url,
      //   target: "_blank"
      // }).appendTo(aHeadline);

      var aSummary = $("<p>").text(data[i].summary);

      // var deleteIcon = $("<i>").addClass("material-icons");
      // deleteIcon.text("delete_forever");

      articleHeader.append(deleteBtn);
      articleBody.append(aSummary);

      card.append(articleHeader, articleBody);

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
