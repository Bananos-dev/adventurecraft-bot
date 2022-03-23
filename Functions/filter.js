const { Client, MessageEmbed } = require("discord.js");
const config = require("../config.json");
/**
 * @param { Client } client
 */

 let infractions = 0;
 let msg1 = "None";
 let msg2 = "None";
 let msg3 = "None";

module.exports = async client => {
    client.on("messageCreate", async(message) => {
        let splitMessage = message.content.split(" ")
        let setOff = false;
        //console.log(splitMessage)

        splitMessage.forEach(v => {
            (function (root) {
              
                function extend(a, b) {
                  for (var property in b) {
                    if (b.hasOwnProperty(property)) {
                      a[property] = b[property];
                    }
                  }
              
                  return a;
                }
              
                function distance(s1, s2, options) {
                  var m = 0;
                  var defaults = { caseSensitive: true };
                  var settings = extend(defaults, options);
                  var i;
                  var j;
              
                  if (s1.length === 0 || s2.length === 0) {
                    return 0;
                  }
              
                  if (!settings.caseSensitive) {
                    s1 = s1.toUpperCase();
                    s2 = s2.toUpperCase();
                  }
              
                  if (s1 === s2) {
                    return 1;
                  }
              
                  var range = (Math.floor(Math.max(s1.length, s2.length) / 2)) - 1;
                  var s1Matches = new Array(s1.length);
                  var s2Matches = new Array(s2.length);
              
                  for (i = 0; i < s1.length; i++) {
                    var low  = (i >= range) ? i - range : 0;
                    var high = (i + range <= (s2.length - 1)) ? (i + range) : (s2.length - 1);
              
                    for (j = low; j <= high; j++) {
                      if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
                        ++m;
                        s1Matches[i] = s2Matches[j] = true;
                        break;
                      }
                    }
                  }
              
                  if (m === 0) {
                    return 0;
                  }
              
                  var k = 0;
                  var numTrans = 0;
              
                  for (i = 0; i < s1.length; i++) {
                    if (s1Matches[i] === true) {
                      for (j = k; j < s2.length; j++) {
                        if (s2Matches[j] === true) {
                          k = j + 1;
                          break;
                        }
                      }
              
                      if (s1[i] !== s2[j]) {
                        ++numTrans;
                      }
                    }
                  }
              
                  var weight = (m / s1.length + m / s2.length + (m - (numTrans / 2)) / m) / 3;
                  var l = 0;
                  var p = 0.1;
              
                  if (weight > 0.7) {
                    while (s1[l] === s2[l] && l < 4) {
                      ++l;
                    }
              
                    weight = weight + l * p * (1 - weight);
                  }
              
                  return weight;
                }
              
                if (typeof define === 'function' && define.amd) {
                  define([], function() {return distance});
                } else if (typeof exports === 'object') {
                  module.exports = distance;
                } else {
                  root.distance = distance;
                }
                const wordArray = ["nigga", "nigger", "wog", "gypsy", "retard", "faggot", "fag"];

                let i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[0], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[1], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[2], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[3], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[4], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[5], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;
                while(i < splitMessage.length && wordArray.length) {
                  if(distance(splitMessage[i], wordArray[6], { caseSensitive: false }) > 0.8 && !message.author.bot) {
                    setOff = true;
                    break;
                  }
                  i++
                }
                i = 0;


                
              })(this);
        });
        if(setOff === true) {
          infractions++;
          if(infractions == 1) msg1 = message.content;
          if(infractions == 2) msg2 = message.content;
          if(infractions == 3) msg3 = message.content;
          const sendEmbed = new MessageEmbed()
          .setColor(config.neutral_color)
          .setTitle("Hey!")
          .setDescription(`Hate speech is prohibited in this server! Continuing will result in a ban.\nYour message: \`\`${message.content}\`\``)
          .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
          const logEmbed = new MessageEmbed()
          .setColor(config.neutral_color)
          .setTitle("Message deleted")
          .setDescription(`A message by ${message.author} (${message.author.id}) has been automatically deleted due to hate speech.\nContent of the message: \`\`${message.content}\`\``)
          .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

          const timeoutEmbed = new MessageEmbed()
          .setColor(config.neutral_color)
          .setTitle("Timed out")
          .setDescription(`You've been timed out for an hour because you reached three automod infractions. These were your last three messages:\n•\`${msg1}\`\n•\`${msg2}\`\n•\`${msg3}\``)
          .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
          const timeoutLogEmbed = new MessageEmbed()
          .setColor(config.neutral_color)
          .setTitle("User timed out")
          .setDescription(`${message.author} has been timed out for an hour due to them reaching three automod infractions. These are their last three messages:\n•\`${msg1}\`\n•\`${msg2}\`\n•\`${msg3}\``)
          .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
          try {
            message.delete();
            client.users.cache.get(message.author.id).send({ embeds: [sendEmbed] });
            client.channels.cache.get(config.mod_log_channel_id).send({ embeds: [logEmbed] });
            if(infractions > 2) {
              client.users.cache.get(message.author.id).send({ embeds: [timeoutEmbed] });
              client.channels.cache.get(config.mod_log_channel_id).send({ embeds: [timeoutLogEmbed] });
              message.author.timeout(3600000, "3 automod infractions reached.");
              infractions = 0;
            }
            setOff = false;
          } catch(err) {
            console.error(err)
          }
        }
        /*console.log(infractions)
        console.log(msg1)
        console.log(msg2)
        console.log(msg3)*/
    });
};