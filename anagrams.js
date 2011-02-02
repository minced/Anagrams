//outline of anagram library

//would be nice to require trie library;
//would have to use jQuery to do so.
console.log("loading anagram library");

//*************************** UTILITY FUNCTIONS 

var isUpperCase = function(string) {
    var check = /[:a-z:]/;
    return !(check.test(string));
};

//http://www.mojavelinux.com/articles/javascript_hashes.html
			
//*************************** LETTER MAP DATA STRUCTURE 

LetterMap.prototype.addLetter = function(l) {
    this.hash[l] ++;
    if (isUpperCase(l)) {
	this.nonSeedRemaining ++;
    } else {
	this.seedRemaining++;
    }
};
//note: does not function properly if this.hash[l] <= 0
LetterMap.prototype.removeLetter = function(l) {
    this.hash[l]--;
    if (isUpperCase(l)) {
	this.nonSeedRemaining --;
    } else {
	this.seedRemaining--;
    }
};
LetterMap.prototype.hasLetter = function(l) {
    return (this.hash[l] > 0);
};
LetterMap.prototype.hasLetterCaseInsensitive = function(l) {
    var m = new String(l); m = m.toUpperCase();
    var u = new String(l); u = l.toLowerCase();
    return this.hasLetter(u) || this.hasLetter(m);
};


LetterMap.prototype.uniqueLettersArray = function() {
    var s = [];
    for (var key in this.hash) {
    	if (this.hash[key] > 0 ) {
    	    s.push(key);
    	}
    }
    return s;
};

LetterMap.prototype.numberSeedLettersRemaining = function() {
    return this.seedRemaining;
};

LetterMap.prototype.numberNonSeedLettersRemaining = function() {
    return this.nonSeedRemaining;
};

LetterMap.prototype.numberLettersRemaining = function() {    
    return this.seedRemaining + this.nonSeedRemaining;
};

LetterMap.prototype.display = function() {
    var remaining = "";
    for (var key in this.hash) {
	if (this.hash[key] > 0) {
	    remaining += key + ":" + this.hash[key] + " ";
	}
    }
    return remaining;
};

function LetterMap(word) {
    this.hash =  Object.create(null, {});
    this.seedRemaining =0;
    this.nonSeedRemaining = 0;

    var A = "A".charCodeAt(0);
    var aa = "a".charCodeAt(0);
    for (var i = 0  ; i < 26 ; i++ )  {
	var letter = String.fromCharCode(A + i);
	this.hash[letter] = 0;
    }
    for (var i = 0  ; i < 26 ; i++ )  {
	var letter = String.fromCharCode(aa + i);
	this.hash[letter] = 0;
    }

    for (var i = 0 ; i < word.length; i ++ ) {
	var letter = word.charAt(i);
	if (letter != ' ' ) {
	    this.addLetter(letter);
	}
    }

};


//*************************** MAIN DATA STRUCTURE: ANAGARM

//uses trie.byrne.js
function Anagram() {
    this.trieRoot = new byrne.TrieNode();
    this.minWordLength = 2;
    this.returnPartialMatch = false;
    this.maxNumberAnagrams = 100;
}

Anagram.prototype.add = function(key) {
    this.trieRoot.add(key);
};
    
Anagram.prototype.loadDictionary = function(string) {
    console.log("splitting dictionary string...");
    var wordList = string.split("|");
    console.log("string splitting complete.");
    for (var key in wordList) {
    	this.add(wordList[key]);
    }
};

// verifies that each word in anagram string contains at least one seed letter.
// NOTE: requires Edmonds-Karp for general poly-time implementation!!
// However, since we don't have many seed letters, DFS works fine :)

//   DFS( seeds, words, depth):

//   for depth = 1 to #words
//   for each seed in word
//   match words[depth] to seed 
//   DFS (seeds - chosenSeed, words, depth++);
 

Anagram.prototype.verifySeedPlacement=  function(seedLetters, anagram) {
    //console.log("checking for presence of seed letters " + seedLetters + " in anagram " + anagram);
    var wordList = anagram.split(" ");
    var seedMap = new LetterMap(seedLetters);
    var depth = 0;
    var currentAssign = {};
    var assigns =[];
    this._seedDFS(seedMap,wordList,depth,currentAssign, assigns);
    if (assigns.length > 0) {
	console.log("assignment of seed letters found:");
	for (var word in assigns[0]) {
	    console.log( word + ":" + assigns[0][word]);
	}
    } else {
	console.log("no assignment found.");
    }
    return (assigns.length > 0);
};

Anagram.prototype._seedDFS = function(seedMap, words, depth, currentAssign, assigns) {

    if (depth == words.length - 1) {
	assigns.push(currentAssign);
	console.log("returning, all words matched!");
	return;
    }
    //console.log("beggining letter-by-letter search");
    var word = words[depth];
    for (var key in seedMap) {
	if (seedMap[key] > 0 && word.indexOf(key) != -1) {
	    console.log("found letter " + key + "in word" +word + " at depth "+ depth);
	    seedMap[key]--; depth++; currentAssign[word] = key;
	    this._seedDFS(seedMap, words, depth, currentAssign, assigns);
	    seedMap[key]++; depth--; 
	}
    }
};

Anagram.prototype.anagram = function(letters) {
    this._anagramMain(letters,"",false);
};

Anagram.prototype.anagramWithSeeds = function(letters,seeds) {
    this._anagramMain(letters,seeds,true);
};

Anagram.prototype._anagramMain = function(letters,seeds,requireSeeds) {
    console.log("anagrammin'");
    //crease empty phraselist
    var phraseList = [];

    //create alphabet property map
    var remainingLetters = new LetterMap(letters.toUpperCase() + seeds.toLowerCase());

    console.log("calling anagram DFS");
    //call _anagram for DFS
    this._anagram(remainingLetters,
		  requireSeeds,
		  "",
		  phraseList,
		  this.trieRoot);
    console.log("...DFS complete.");
    console.log("phrases found: " );
    for (var key in phraseList)  {
    	console.log(phraseList[key]);
    }

    return phraseList;
};


/*
  anagram(remaining, phrase, phraseList, node)
  if (node is word)
  phraseList.append( anagram(remaining,phrase + " ",phraseList,root)
  for each letter remaining:
  if node has child under letter:
  phraseList.append( anagram(remaining - letter, phrase + letter, phraseList,root))

  note that if node is terminal, nothing happens in final loops

  as an optimization, remainingLetters is a property map;
  remainingLetters[i] = number of occurences of letter i in 
  original word

  TODO: minimum word length
  TODO: require seed letters (GIVEN IN LOWERCASE AMONGST remainingLetters MAP)
  Could use extra "useSeedLetters" parameter, though it's clunky

*/
Anagram.prototype._anagram = function(remainingLetters,
				      requireSeeds,
				      phrase,
				      phraseList,
				      node) {
    if (phraseList.length >= this.maxNumberAnagrams) 
	return;

    var letterCount = remainingLetters.numberLettersRemaining();
    var nonSeedLetterCount = remainingLetters.numberNonSeedLettersRemaining();
    //var letters = remainingLetters.uniqueLettersArray();

    //reached a word - goal is to use up letters, so branch before DFS
    if (node.wordCount) {
	//	console.log("reached phrase:" + phrase);
	//TODO impose min word length here
	//split last word off
	var words = phrase.split(" ");
	var lastWord = words.pop();
	if (lastWord.length < this.minWordLength) {
	    //	    console.log("Word was too short: " + lastWord);
	    return;
	}
	if (requireSeeds) {
	    if (isUpperCase(lastWord)) {
		//	console.log("Word did not use seed letters: " + lastWord);
		return;
	    }
	}
	if (letterCount === 0 || (requireSeeds && (nonSeedLetterCount == 0)) ) {
	    phraseList.push(phrase);
	    return;
	} else {
	    // console.log(letterCount + " letters remain; continuing DFS.");
	    if (this.returnPartialMatch) {
		phraseList.push(phrase);
	    }
	    this._anagram(remainingLetters,
			  requireSeeds,
			  phrase + " ",
			  phraseList,
			  this.trieRoot);
	}
    }

    //DFS using letters (and seeds, if requireSeeds set) remaining
    for (var key in remainingLetters.hash) {
	if (remainingLetters.hash[key] > 0) {
	    // var letter = letters[key];
	    var letter = key;
	    var l = new String(letter); l = l.toUpperCase();
	    if (node.children[l]) {
		remainingLetters.removeLetter(letter);
		this._anagram(remainingLetters,
			      requireSeeds,
			      phrase + letter,
			      phraseList,
			      node.children[l]);
		remainingLetters.addLetter(letter);
	    }
	}
    }
}

