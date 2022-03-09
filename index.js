const { Client, Collection } = require("discord.js");
const client = new Client({intents: 4615});
const config = require("./config.json");
const ping = require("ping");
const interactionCreate = require("./Events/Interaction/interactionCreate");

(function (root) {
  'use strict';

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

  var wordArray = ["nigga", "nigger"];

  let i = 0;
  while(i < 2) {
    let wordMatch = distance("badword1", wordArray[i], { caseSensitive: false });
    if(wordMatch > 0.8) {
      console.log("racist detected!");
      break;
    }
    i++
  }

})(this);

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);
require("./Functions/filter")(client);

client.login(config.token);