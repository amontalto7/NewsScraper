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
