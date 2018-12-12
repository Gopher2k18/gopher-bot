# About
This is a slack bot that can push some messages from a public channel to a mongoDB database.
It can do it with the following messages:
* Messages containing channel keywords
* Messages that have a lot of reactions
* Messages that are origins of long threads


## Prerequisites 
* A mongoDB database
* A slack app
* A way to expose the bot to the internet(eg. hosting it on heroku)

## Set up
Download the repo and run npm install
Next you can either define yout slack app client id and client server as clientId and clientSecret enviromental varaibles or specify them when you start the bot. MongoDB adress must be specified in the MONGO_URI enviromental varaible.
You can start the bot with `npm start` or if you haven used enviromental variables with `clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js`
When the bot is running go to it's adress to find a button to add it to your slack server
Now all you need to do is add some keywords to your channels. This is done by simply writing them in the channels purpose as `tags: <tag1>, <tag2>`. This must be done before you add a bot to a channel. When the bot is invited to a channel it will start listening to the channel and it's tags.
