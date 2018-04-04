//Don't forget to run npm installs in this folder first:
//npm install request --save 
//npm install twitter --save
//npm install --save node-spotify-api
//npm install dotenv --save

//access environmental variables in .env file
//load variables into process.env
require("dotenv").config();

//build access keys for api's -- import fron keys.js
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request"); //OMDB

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var songQuery; //this will be track to search for at Spotify
var movieName; //this will be the movie to search for at OMDB
//____________________________

//What is user asking for?
var userRequest = process.argv[2];

switch (userRequest) {

    case ('my-tweets'): 
      latestTweets();
      break;

    case ('spotify-this-song'):
      song();
      break;

    case ('movie-this'):
      movie();
      break;

    case('do-what-it-says'):
      dataFile();
      break;
}

//Function will display last 20 tweets 
function latestTweets() {
    console.log("\n Latest Tweets:\n ")

    //parameters:  twitter name and 20 tweets(ACTUALY 13) ...recommended by npm: include retweets set to 1
    var params = {screen_name: 'LilyDDog', count: 20, include_rts:1};
    
    //GET last 20 tweets from timeline
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {

        //print each with line breaks   ....use 13 to reflect actual
        for(var i=0; i<13; i++){
          console.log(tweets[i].text +"\n tweeted : " + tweets[i].created_at +"\n");
        }
      }
    });
}

// Function will display song name/artist/album/preview link
function song(){
    console.log("\n Song Info\n");
    //console.log(process.argv[3]);
   
    //DEFAULT VALUE:  if user did not include song title.
    if(!process.argv[3]){ 
        songQuery = "Ace of Base";
    }
    //USER INPUT: Otherwise user input argv3 is track title
    else {
        songQuery = process.argv[3];
    }
    spotQ();

}
    //QUERY SPOTIFY for track and related info
function spotQ() {
    spotify.search({ type: 'track', query:songQuery }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        // Display song info
        console.log("Song Name: " + data.tracks.items[0].name); 
        //*************************display all artists - loop thru  i<artists.length */
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name); 
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview a sample here: " + data.tracks.items[0].preview_url);
    });
    }  //end of spotify query 


function movie() {

    // Grab the movieName which will always be the third node argument.
    movieName = process.argv[3];

    movieQ();
};

function movieQ() {
    // Run a request to the OMDB API with the movie name specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // SEND OMDB Movie request
    request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {

        var jpb = JSON.parse(body);
        // Parse the body of the page to find the parameters req'd
        console.log("\nMovie Info\n")
        console.log(
        "Movie Title: " + jpb.Title + 
        "\nRelease Year: " + jpb.Year +
        "\nIMDB Rating: " + jpb.Ratings[0].Value +
        "\nRotten Tomatoes Rating: " + jpb.Ratings[1].Value +
        "\nCountry produced in: " + jpb.Country +
        "\nLanguage of the movie: " + jpb.Language +
        "\nPlot: " + jpb.Plot + 
        "\nActors: " + jpb.Actors);

        // Parameters:  Year   Actors   Plot   Language   Country   Rating.Source.
      }
    });

}
// Do-what-it-says :  using a data file to direct the query
function dataFile() {

    var fs = require("fs");

    fs.readFile("./random.txt", "utf8", function(error, data) {

    // If errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
  
    // We will then re-display the content as an array for later use.
    console.log("The data file contents are : " + dataArr + "\n");
  
    
    switch (dataArr[0]) {

        case ('my-tweets'): 
          latestTweets();
          break;
    
        case ('spotify-this-song'):
          songQuery = dataArr[1]
          spotQ();
          break;
    
        case ('movie-this'):
          movieName = dataArr[1]
          movieQ();
          break;
    }

    });
}