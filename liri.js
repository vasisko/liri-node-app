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

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

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
      random();
      break;
}

//Function will display last 20 tweets 
function latestTweets() {
    console.log("\n Latest Tweets:\n ")

    //parameters:  twitter name and 20 tweets ...recommendedby npm--include retweets set to 1
    var params = {screen_name: 'LilyDDog', count: 20, include_rts:1};
    
    //GET last 20 tweets from timeline
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {

        //print each with line breaks
        for(var i=0; i<5; i++){
          console.log(tweets[i].text +"\n tweeted : " + tweets[i].created_at +"\n");
        }
      }
    });
}

// Function will display song name/artist/album/preview link
function song(){
    console.log("\n Song Info\n");
    //console.log(process.argv[3]);
   
    var songTitle; //this will be track to search for at Spotify
    
    //Use default value if user did not include song title.
    //Otherwise user input argv3 is track title
    if(!process.argv[3]){ songTitle = "the sign";}
    else {songTitle = process.argv[3];};

    //console.log(songTitle);

    //Query Spotify for track and related info
    spotify.search({ type: 'track', query:songTitle }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
          }
        
        console.log("Song Name: " + data.tracks.items[0].name); 
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name); 
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview a sample here: " + data.tracks.items[0].preview_url);
        
      });
}

function movie() {

    //OMDB Movie info request
    var request = require("request");

    // Grab the movieName which will always be the third node argument.
    var movieName = process.argv[3];

    // ****  TO DO:
    //add "+" between words:  ie: the+bird+cage

    // Run a request to the OMDB API with the movie name specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //For debugging
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

      // If the request is successful
      if (!error && response.statusCode === 200) {

        // Parse the body of the page to find the parameters req'd
        console.log("\nMovie Info\n")
        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country produced in: " + JSON.parse(body).Country);
        console.log("Language of the movie: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);

        // Parameters:  Year   Actors   Plot   Language   Country   Rating.Source.
      }
    });
};
