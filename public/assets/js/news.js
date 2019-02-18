$(".btnScrape").click(function(event) {
  event.preventDefault();
  let section = $("#section")
    .val()
    .trim();

  $.ajax({
    method: "GET",
    url: "/scrape/" + section
  }).then(function(data) {
    console.log(data);
  });
});
