/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
var request = require("request");
var config = require('./config.json');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'my Precious';
const WELCOME_MSG = 'Hello, Welcome to my precious app, <break time="1s" /> You can ask current gold or silver rates in india By saying, <break time="1s" /> todays gold rate';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'you can open by saying <break time="1s" /> my precious You can ask current gold or silver rates By saying, <break time="1s" /> todays gold rate';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const INPUT_REPROMPT = 'Please say that again';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
var priceDetails;
const handlers = {
  'LaunchRequest': function () {
    this.emit('welcomeMsg');
  },
  'welcomeMsg': function () {
    this.response.speak(WELCOME_MSG).listen();
    this.emit(':responseReady');
  },
  'ratecheck': function () {
    this.emit('SayCurrentMetalPrice');
  },
  'Unhandled': function () {
    this.response.speak('error').listen(INPUT_REPROMPT);
  },
  'SayCurrentMetalPrice': function () {
    var app = this;
    var type = this.event.request.intent.slots.metal.value;
    var url = config[type];
    function getResponse() {
      // Return new promise 
      return new Promise(function (resolve, reject) {
        // Do async job
        request.get(url, function (err, resp, body) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(body));
          }
        })
      })
    }

    function getMetalRates() {
      var initializePromise = getResponse();
      initializePromise.then(function (result) {
        var price = result.data[0][4];
        if (type == 'gold') {
          price = price/10 + ' rupees per gram';
        } else {
          price = price/1000 + ' rupees per gram';
        }
       app.response.speak('Todays price for ' + type + 'is <break time="1s"/>' + price).listen(INPUT_REPROMPT);
       app.emit(':responseReady');
      }, function (err) {
        console.log('err')
      })
    }
    getMetalRates();
  },
  'AMAZON.HelpIntent': function () {
    this.response.speak(HELP_MESSAGE).listen(); this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('good bye'); this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('good bye'); this.emit(':responseReady');
  },
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
