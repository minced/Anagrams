

//global abatement (see Javascript: the good parts)
var ANAGRAMOBJECT = {};

/*

//player class ****************************************

ANAGRAMOBJECT.player.prototype = function ( ) {
    this.score = 0;
    //words are in hash as keys - value for key is score for word
    this.words = {};
    this.name = "";
    this.agent = null;
}; 

//player agent ****************************************

ANAGRAMOBJECT.agent.prototype = function ( ) {

};

//AI agent  ****************************************

ANAGRAMOBJECT.AIPlayerAgent.prototype = new ANAGRAMOBJECT.agent();

//remote agent  ****************************************

ANAGRAMOBJECT.remotePlayerAgent.prototype = new ANAGRAMOBJECT.agent();

//local agent  ****************************************

ANAGRAMOBJECT.localPlayerAgent.prototype = new ANAGRAMOBJECT.agent();

//timer ****************************************
//using pattern from section 4.10 of "javascript: the good parts" to include "private" variables.

//To create a timer, use
// var myTimer = ANAGRAMOBJECT.makeTimer(id, callback);

*/

// id: id of DOM element to display time 
// callback: function to be called when time is up.
ANAGRAMOBJECT.makeTimer = function (id,callback ) {
    var countdown = -1;

    var displayCountdown = function() {
	console.log("displayCountdown: countdown = " + countdown);
	if (countdown < 0) {
	    callback();
	    return;
	}
	document.getElementById(id).innerHTML = countdown;
	countdown--;
	setTimeout(displayCountdown, 1000);
    };

    var startCountdown = function (c) {
	console.log("startCountdown: countdown = " + countdown);
	countdown = c;
	displayCountdown();
    };

    return { 
	startCountdown: startCountdown
	    };
};

