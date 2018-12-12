var ChannelInfo = require('../models/channelInfoModel');

// This fetches tags from the slack channel purpose when the bot is added to a channel and saves them to the db
module.exports = function (controller) {

    controller.on('bot_channel_join',
        function (bot, message) {
            let data = {}
            console.log(message)
            bot.api.channels.info({ channel: message.channel }, function (error, response) {

                splitString()

                function splitString() {

                    var tags = response.channel.purpose.value

                    var tagCutter = "tags: "
                    tags = tags.substring(tags.indexOf(tagCutter) + tagCutter.length)

                    tags = tags.split(", ")

                    console.log(response.channel.purpose.value)
                    console.log('WTF' + tags)

                    var channelInfo = new ChannelInfo(
                        {
                            channelId: response.channel.id,
                            channelName: response.channel.name,
                            tags: tags
                        });


                    channelInfo.save(function (err) {
                        if (err) { console.log(err) }
                        else {
                            require('../components/listener_setup.js')(controller, channelInfo)
                            console.log("channel info saved")
                        }
                    });
                }
            })
        });
}