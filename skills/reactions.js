var Message = require('../models/messageModel');
var ChannelInfo = require('../models/channelInfoModel');

// This checks when a reaction is added if a message hits the reaction threashold and if yes it gets pushed to db
module.exports = function (controller) {
    controller.on('reaction_added', function (bot, message) {

        console.log('reaction added?')
        console.log(message)

        bot.api.reactions.get({
            channel: message.event.item.channel,
            timestamp: message.event.item.ts
        }, function (error, response) {
            console.log('api req here')
            console.log(response)
            let reactions_count = 0
            response.message.reactions.forEach(element => {
                console.log(element)
                reactions_count += element.count
            });

            if (reactions_count > 4) {
                bot.api.users.info({ user: response.message.user }, function (error, response2) {
                    console.log('second response')
                    console.log(response2);
                    ChannelInfo.findOne({channelId: message.item.channel}, (err, res)=>{

                        console.log(message.item.ts)
                        
                        let cont = {
                            user: response2.user.real_name,
                            channel: res.channelName,
                            tags: ["Reactive"],
                            time_send: Math.trunc(message.item.ts).toString(),
                            message: response.message.text,
                            link: response.message.permalink
                        }
                        dbmsg = new Message(cont)
                        console.log(dbmsg);
                        dbmsg.save(function (err) {
                            if (err) { console.log(err) }
                            else {
                                console.log("message saved")
                            }
                        })
    
    
                    })
                    
                })
            }
        })
    })
}