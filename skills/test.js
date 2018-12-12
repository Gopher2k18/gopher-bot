var Message = require('../models/messageModel');
var ChannelInfo = require('../models/channelInfoModel');

// Listens to all messages and redirects them to the appropriet channel listener unless if it's a thread event
module.exports = function (controller) {
    controller.on('ambient', function (bot, message) {
        if (!message.thread_ts) {
            controller.trigger(message.channel, [bot, message])
        } else {  // This handles slack threads

            console.log('thread')

            bot.api.reactions.get({
                channel: message.channel,
                timestamp: message.thread_ts
            }, function (error, response) {

                console.log(`GET REACTIONS`)
                console.log(response)
                if (response.message.reply_count > 4) {

                    bot.api.users.info({ user: response.message.user }, function (error, response2) {
                        console.log(`USER INFO ${response2}`)
                        ChannelInfo.findOne({channelId: response.channel},(err, res)=>{
                            let msg = {
                                user:response2.user.real_name,
                                message: response.message.text,
                                channel: res.channelName,
                                tags: ['Popular thread'],
                                time_send: Math.trunc(response.message.thread_ts),
                                link: response.message.permalink
                            }
                            const msg2 = new Message(msg)
                            console.log(msg2)
                            msg2.save((function (err) {
                                if (err) { console.log(err) }
                                console.log("pass")
                            }));
                        })
                    })
                }
            })
        }
    })

    controller.on('interactive_message_callback', function (bot, message) {
        controller.trigger(`interactive_message_callback_${message.channel}`, [bot, message])
    })
}