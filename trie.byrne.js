
byrne = {}; // create the namespace

/**
 * @see http://en.wikipedia.org/wiki/Trie
 * @author Dennis Byrne
 * @constructor 
 */
byrne.TrieNode = function(){
    //minced: whether this node is terminal
    //from what i can tell wordCount is always 0 or 1
    //unless same word added multiple times.
    this.wordCount = 0;
    //minced: number of "terminal" nodes STRICTLY underneath this one
    this.prefixCount = 0;
    //list of children
    this.children = [];
};

byrne.TrieNode.prototype.add = function(word) {
    if(word){
	this.prefixCount++;
	var k = word.charAt(0);
	(this.children[k] || (this.children[k] = new byrne.TrieNode()))
	.add(word.substring(1));
    }else
	this.wordCount++;
};

/**
 * Retrieve the prefix count of the applied argument w/ recursion.
 */
byrne.TrieNode.prototype.getPrefixCount = function(word){
    return word ?
    this.getCount(word, arguments.callee) : this.prefixCount;
};

/**
 * Retrieve the word count of the applied argument w/ recursion.
 */
byrne.TrieNode.prototype.getWordCount = function(word){
    return word ?
    this.getCount(word, arguments.callee) : this.wordCount;
};

/**
 * @private
 */
byrne.TrieNode.prototype.getCount = function(word, method){
    var k = word.charAt(0);
    return this.children[k] ?
    method.call(this.children[k], word.substring(1)) : 0;
};