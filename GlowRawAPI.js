"use strict";
var https = require('https');
const crypto = require('crypto');



class GlowRawAPI {
  static fetchLoginToken(email, password, callback) {
    var options = {
      host: 'baby.glowing.com',
      path: '/android/user/sign_in',
      method: 'POST'
    };
    var req = https.request(options, response => {
      var body = '';
      response.on('data', d => {
        body += d;
      });
      response.on('end', () => {
        var parsed = JSON.parse(body);
        if (parsed.msg) {
          console.log("ERROR");
          console.log(body);
          return;
        }
        console.log(JSON.stringify(parsed))
        callback(parsed);
      });
    });

    req.write(JSON.stringify({email: email, password: password}))
    req.end();
  }

  static generateRandomHexString() {
    const array = new Uint8Array(16); // Create a typed array with 16 bytes
    crypto.getRandomValues(array); // Fill the array with cryptographically random values
  
    const hexChars = [...array].map((byte) => {
      return ('0' + byte.toString(16)).slice(-2); // Convert byte to 2-digit hex string
    }).join('');
  
    return hexChars.slice(0, 16); // Return the first 16 characters (ensure 16 hex digits)
  }
  
  // Example usage

  static pushBabyData(login_token,value) {
    var current_time = Date.now();
    var headers = {
      'GlowOccurTime':  current_time,
      'Request-Id': this.generateRandomHexString() +"-" + current_time,
      'Authorization': login_token,
      'Content-Type': 'application/json; charset=utf-8',
      'Host': 'baby.glowing.com',
      'User-Agent': 'okhttp/3.4.1'
    };
    console.log(JSON.stringify(headers));

    const today = new Date();
console.log(today)
const year = today.getFullYear();
const month = today.getMonth() + 1; // Get month (0-indexed)
const day = today.getDate();

// Use conditional statements for single-digit formatting
const monthString = month < 10 ? '0' + month : month;
const dayString = day < 10 ? '0' + day : day;

const dateLabel = year + '/' + monthString + '/' + dayString;

const hours = today.getHours();
const minutes = today.getMinutes();
const seconds = today.getSeconds();

// Use conditional statements for single-digit formatting
const hoursString = hours < 10 ? '0' + hours : hours;
const minutesString = minutes < 10 ? '0' + minutes : minutes;
const secondsString = "00"

const startTimeLabel = dateLabel + ' ' + hoursString + ':' + minutesString + ':' + secondsString;


const startTimeStamp = Math.floor(today.getTime() / 1000); // Get timestamp in seconds

  
    var dataString = JSON.stringify({
      "items": [
        {
          "babies": [
            {
              "baby_id": 3107474,
              "BabyData": {
                "create": [
                  {
                    "uuid": crypto.randomUUID(),
                    "baby_id": 3107474,
                    "action_user_id": 72057594060131400,
                    "key": "diaper",
  									"date_label": dateLabel,
  									"start_time_label": startTimeLabel,
  									"start_timestamp": startTimeStamp,
                    "val_int":value, // 65536,
                    "val_text": "look Kelley it works"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
    );

    function constructUrlWithRandomTime(baseUrl, otherParams) {
      const currentTime = Date.now();
      const urlParams = new URLSearchParams({
        random: currentTime,
        ...otherParams, // Spread operator to include other parameters
      });
    
      const completeUrl = `${baseUrl}?${urlParams.toString()}`;
      return completeUrl;
    }
    
    const baseUrl = 'https://baby.glowing.com/android/user/push';
    const otherParams = {
      android_version: '4.44.1',
    };
    
    const finalUrl = constructUrlWithRandomTime(baseUrl, otherParams);

    var options = {
      path: finalUrl,
      host: 'baby.glowing.com',
      method: 'PATCH',
      headers: headers,
    };  
    console.log(JSON.stringify(options));
    console.log(JSON.stringify(dataString))

    var req = https.request(options, function(response) {
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
        console.log("request finished")
        console.log(body);

      });
      response.on('error', function() {
        console.log('errrrrr');
      });
    });

    req.write(dataString);
    req.on('error', function(e) {
      console.log(e);
    });
    req.end();

  }
/*

   fetchSyncData(login_token, callback) {
    // Stuff I copied from the Android app
    var headers = {
      'GlowOccurTime': '1501282746855',
      'Request-Id': '559aaae19e0b1535-1501282746855',
      'Authorization': login_token,
      'Content-Type': 'application/json; charset=utf-8',
      'Host': 'baby.glowing.com',
      'User-Agent': 'okhttp/3.4.1'
    };

    // var babies = [];
    // var user = {};
    // if (baby_id && baby_sync_token) {
    //   babies = [{sync_token: baby_sync_token, baby_id: baby_id}];
    // }

    // if (user_sync_token) {
    //   user.sync_token = user_sync_token;
    // }

    // var dataString = JSON.stringify({
    //   data: {
    //     babies: babies,
    //     user: user
    //   }
    // });

    var options = {
      path: 'https://baby.glowing.com/android/user/pull?hl=en_US&random=7645523890115&device_id=79906fb6942e9c92&android_version=1.7.4&vc=10704&tz=America/New_York&code_name=noah',
      host: 'baby.glowing.com',
      method: 'POST',
      headers: headers,
    };
    http.makeRequest(options, function(err,response) {
      console.log("error is " + JSON.stringify(err))
			console.log("response is " + JSON.stringify(response))
    });
*/
  
}

module.exports = GlowRawAPI;
