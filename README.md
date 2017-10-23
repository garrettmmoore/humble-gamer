# Humble Gamer
### By Garrett Moore

## Deployed Here: http://humblegamer.herokuapp.com/

# Application
Hello! Welcome to Humble Gamer! This full-stack site allows users to view and leave comments on the latest video game news articles.

# Built With

Humble Gamer is built using JavaScript, node.js, and Express to query and route data, BootStrap, CSS, and Handlebars to generate the HTML. The news articles are scraped from the video game news site 'Polygon' using Cheerio. The application is currently deployed to Heroku and uses the popular noSQL Database MongoDB.

Node Packages Used: express, express-handlebars, mongoose, body-parser, cheerio, and request

# Getting Started

## Prerequisites
1. Create a GitHub repo for this assignment and clone it to your computer.
2. Heroku Account:
    1. Create a Heroku account for deployment here https://www.heroku.com/ .
3. Install MongoDB
    1. For installation assistance visit https://docs.mongodb.com/manual/installation/ .

## Installing
1. Open up the project and run npm install.
2. The following npm packages should now be installed:
    1. express
    2. mongoose
    3. express-handlebars
    4. body-parser
    5. cheerio
    6. request

## Deployment
1. In order to deploy the project to Heroku, you need to set up an mLab provision. mLab is a remote MongoDB database that Heroku supports natively.
    1. Create a Heroku app in your project directory.
    2. Run 'heroku addons:create mongolab' in your Terminal/Bash window:
2. You'll need to find the URI string that connects Mongoose to mLab. Run this command to retrieve that string:
    1. 'heroku config | grep MONGODB_URI'
3. When you’re ready to connect Mongoose with your remote database, simply paste the URI string as the lone argument of your mongoose.connect() function.

# Using Humble Gamer

## Step 1 - Scrape Articles
1. User clicks "SCRAPE NEW ARTICLES" button.

![scrape-button](/images/scrape-button.png)

2. Aricles will be scraped from Polygon and displayed in the news feed.
3. User's can click the article link to be redirected to that specific article.

![sample-article](/images/sample-article.png)

## Step 2 - Commenting
1. Every article has it's own "Comment" button.
2. A user has the option of leaving a comment(taking notes for personal use) on any specific article that's been scraped.
3. A comment can be made by clicking the "Comment" button attached to each article listing, typing in the input field under "Notes", and then clicking "Save Note".
    1. The comment will not be saved if "Save Note" is not clicked after entering information.
4. To view your comment, simply click on the "Comment" button again to view your saved note or add more information to that particluar note.
5. To delete a comment, highlight the text you want to delete and press delete on your keyboard. Then click "save note" to update the database.

![sample-note](/images/sample-note.png)

## Step 3 - Saving
1. A user has the option of saving as many articles as they please.
2. An article can be saved by clicking the "Save Article" button.
    1. This will add the saved article to the database.
3. The saved articles can be found by clicking the "All Saved Articles" button located in the navigation bar.
4. Here, users can view all of the saved articles and comments as well as delete any articles by clicking the "Delete" button attached to each article listing.

![navbar-example](/images/navbar-example.png)

## End
Thank you for using Humble Gamer! Please contact me directly if you have any questions or suggestions.

https://github.com/garrettmmoore