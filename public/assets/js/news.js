// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].headline +
        "<br />" +
        data[i].url +
        "</p>"
    );
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
