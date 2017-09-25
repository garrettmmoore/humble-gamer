// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      createNewOption(data[i])
      // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });

  function createNewOption(data){
    var newCardDeck = $("<div class='card-deck'>");
    var newCardDiv = $("<div class='card text-center' style='width: 20rem;'>");
    var nextNewDiv = $("<div class='card-body'>");
    var cardTitle = $("<p data-id='" + data._id + "'>").text("ID: " + data._id);
    console.log(cardTitle);
    var newResBody = $("<p class='card-text'>").text("Description: " + data.title);
    var newMonthBody = $("<p class='card-text'>").text("Link: " + data.link);
    var button = $("<button data-id='" + data._id + "' id='comment'>Comment</button>")

    $("#articles").append(newCardDeck);
    newCardDeck.append(newCardDiv);
    newCardDiv.append(nextNewDiv);
    nextNewDiv.append(cardTitle);
    nextNewDiv.append(newResBody);
    nextNewDiv.append(newMonthBody);
    nextNewDiv.append(button);

    return newCardDiv;
};

  // Whenever someone clicks a p tag
  $(document).on("click", "#comment", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });