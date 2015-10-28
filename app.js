window.Instagram = {
    /**

     * Store application settings
     */
    config: {},

    BASE_URL: 'https://api.instagram.com/v1',

    init: function (opt) {
        opt = opt || {};

        this.config.client_id = opt.client_id;
    },

    /**
     * Get a list of recently tagged media.
     */
    tagsByName: function (name, callback) {
        var endpoint = this.BASE_URL + '/tags/' + name + '/media/recent?client_id=' + this.config.client_id + "&count=40";
        this.getJSON(endpoint, callback);
    },
    /**
     * Get the info about user
     */

    userInfo: function (id, callback) {
        var endpoint = this.BASE_URL + '/users/' + id + '/?client_id=' + this.config.client_id;
        this.getJSON(endpoint, callback);
    },

    getJSON: function (url, callback) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: function (response) {
                if (typeof callback === 'function') callback(response);
            }
        });
    }
};

Instagram.init({
    client_id: 'd49da08a520f47cbb6e7618f077f33ef'
});


$(document).ready(function () {

    var names = new Array();
    var positiveattitude = new Array();
    var numberofLikes = new Array();
    var tagName = "capitalone";
    Instagram.tagsByName(tagName, function (response) {
        var $instagram = $('#instagram');
        var $likes = $('#likes');

        positive = 0;
        negative = 0;
        neutral = 0;
        for (var i = 0; i < response.data.length; i++) {
            like = response.data[i].likes;
            user = response.data[i].user.username;
            imageUrl = response.data[i].images.low_resolution.url;
            // appending image div to our webpage with required variables and some html
            $instagram.append('<div id ="imageContainer""> <div id="img" ><img src="'
                + imageUrl + '"width="180px" height:180px />' + '</br>Likes: '
                + like.count + '</br>User: ' + user + '</div></div>\n');

            numberofLikes.push(response.data[i].likes.count);
            names.push(response.data[i].user.id);
            // line 73-75 takes the caption of each photo and splits that string into words
            var res = response.data[i].caption.text;
            var exs = res.split(" ");
            //line 76-81 is the list of words that created for centiment analysis
            var negatives = new RegExp("^(never|shit|Chelsea are|in the|from the|nowhere|noone|none|not|havent|hasnt|hadnt|cant" +
                "|couldnt|shouldnt|wont|wouldnt|dont|doesnt|didnt|isnt|arent|ain't)$");
            var positives = new RegExp("^(thanks|lol|blessed|thankyou|love|better|thankful|fun|win" +
                "|won|funny|impressive|great|company|good|#capitalone|#selenagomez|wonderful|amazing|nice" +
                "|awesome|beautiful|kind|sick|best|can|like)$");

            negativeWords = 0;
            positiveWords = 0;
            //following for loop is for iterating through the caption String and count the number of matches with regex
            for (m = 0; m < exs.length; m++) {
                if (exs[m].match(positives)) {
                    positiveWords++;
                }
                else if (exs[m].match(negatives)) {
                    negativeWords++;

                }
            }
            //adding positive words to array, in order to use this array for graping
            positiveattitude.push(positiveWords);
            //following conditional compares the number of positive and negative words
            //with result of this statements I found whether post is positive/negative/neutral towards #CapitalOne
            if (positiveWords > negativeWords) {
                positive++;
            }
            else if (negativeWords > positiveWords) {
                negative++;
            }
            else {
                neutral++;
            }

        };

        var $sentiment = $('#sentiment');
        $sentiment.append("As a result of the sentiment analysis algorithm that I developed," +
            " out of " + response.data.length + " pictures " + positive + " " +
            " pictures are POSITIVE , " + negative + " pictures are NEGATIVE and " + neutral + "  pictures are NEUTRAL"+'</br></br>');
        var $graphLines = $('#graphLines');
        $graphLines.append("-The blue line shows the number of potsitive sentiments in given post's capition ."
            + '</br>' + "" + "And the orange line shows the number of likes for the media elemetn. " +
            '</br>' + " Looks like the trend is fluctuating, and it is hard do define if the trend is positive or negative"+'</br></br>')

        //generating graph using d3
        var chart = c3.generate({
            bindto: '#sentimentAnalyses',
            data: {
                columns: [
                    positiveattitude,
                    numberofLikes
                ]
            }
        });

        var newarray = names;
        // This for loop iterates through the list of people who recently used #capital one and
        // uses their id for accessing their information with Instagram API
        for (var b = 0; b < newarray.length; b++) {
            var id = newarray[b];
            Instagram.userInfo(id, function (response) {
                var $infouser = $('#infouser');
                user = response.data.counts.media;
                $infouser.append('<div id="userinfo""><div id="userinfoboxes">'
                    + response.data.full_name + '</br>' + response.data.username + ' has : '
                    + response.data.counts.media + ' media</br> ' + 'followed by: '
                    + response.data.counts.followed_by + ' people</br>' + 'followes: '
                    + response.data.counts.follows + ' people</br></div></div>');
            });
        }
        ;
    });

});









       
        
    

