var Message = require('../models/messageModel');

module.exports = function (controller, channel) {

    let msgMap = new Map()

    controller.hears(channel.tags, channel.channelId,
        function (bot, message) {
            let data = {}

                bot.api.users.info({ user: message.user }, function (error, response) {
                    data.user = response.user.real_name

                    let msg = {
                        user: data.user,
                        message: message.text,
                        channel: channel.channelName,
                        tags: [message.match[0]],
                        time_send: message.event_time.toString(),
                        link: `https://letstesthere.slack.com/archives/${channel.channelId}/p${message.event_time.toString()}`
                    };

                    console.log(msg)

                    msgMap.set(message.event_time.toString(), msg)
                    console.log(msgMap.get(message.event_time))

                    bot.whisper(message, {
                        attachments: [
                            {
                                title: `Your message contained the "${message.match[0]}" keyword, publish it on gopher?`,
                                text: `Message: ${message.text}`,
                                callback_id: message.event_time,
                                attachment_type: 'default',
                                actions: [
                                    {
                                        "name": "yes",
                                        "text": "Yes, please",
                                        "value": "da",
                                        "type": "button",
                                    },
                                    {
                                        "name": "no",
                                        "text": "No dont",
                                        "value": "nyet",
                                        "type": "button",
                                    }
                                ]
                            }
                        ]
                    });

                })
        });

    controller.on(`interactive_message_callback_${channel.channelId}`, function (bot, message) {

        console.log(message)

        if (message.actions[0].name === 'yes') {
            console.log(msgMap.get(message.callback_id))
            let msg = new Message(msgMap.get(message.callback_id))
            console.log(msg);
            // msg.save((function (err) {
            //     if (err) { console.log(err) }
            //     console.log("pass")
            // }));
            bot.replyInteractive(message, {
                title: 'Sent',
                text: 'See it on the website'
            }, function (err) {

            })
        } else {
            msgMap.delete(message.callback_id)
            bot.replyInteractive(message, {
                title: 'Declined',
                text: 'Not on website'
            }, function (err) {

            })
        }
    })
}