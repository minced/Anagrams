var hello = function () {
    var n = document.getElementById("results");
    var form = document.forms["anagramOptions"];

    
    if (!dictionaryIsLoaded) {
    	n.innerHTML= "Loading dictionary, please wait...";
    	anagramer.loadDictionary(words);
    }
      
    n.innerHTML = "loading matches, please wait...";

    var wordLimit = form.elements["wordLimit"].value;
    wordLimit = (wordLimit === "any") ? 0 : parseInt(wordLimit);
    console.log("requiring at least " + wordLimit + " letters in each word");
      
      
    var matchLimit =parseInt( form.elements["matchLimit"].value);
    console.log("limiting to " + matchLimit + " matches");

    var useSeeds = form.elements["useSeedLetters"].checked;
    console.log("using seed letters: " + useSeeds);

    var letters = form.elements["letters"].value;
    console.log("using letters: " + letters);

    var seeds = "";
    if (useSeeds) {
    	seeds = form.elements["seedLetters"].value;
    	console.log("seed letters: " + seeds );
    }


    anagramer.minWordLength = wordLimit;
    anagramer.maxNumberAnagrams = matchLimit;
    var results;
    if (useSeeds) {
    	results = anagramer.anagramWithSeeds(letters,seeds);
    } else {
    	results = anagramer.anagram(letters);
    }

    n.innerHTML = "";
    for (var key in results) {
	n.innerHTML += results[key] + "<br/>";
    } 
}
