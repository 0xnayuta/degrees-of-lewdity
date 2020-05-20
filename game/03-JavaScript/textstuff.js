/*
stuff needed to make virginity loss event descriptions work
copied from
https://gitgud.io/Pedy/Degrees_Of_Pedity
removed stuff not actually used

*/

//return random
//if used with one value, it will be set as the maximum, while the minimum will be 0
//with both values you will set the boundaries for possible random
//this generator includes the value you specify, so random with argument 1 will generate between 0 and 1 (50%)
//make sure it can generate at least more than one value because I didn't make a throw case if it doesn't
window.jsRandom = function(min,max) {
	if (max == undefined) max = min, min = 0;
    return Math.floor(Math.random()*(max-min+1)+min);
};

// seems to do baiscally same as either()
//splitter can be specified, by default it's :
window.jsSplitr = function(choices, splitter) {
	if (splitter == undefined) var splitter = ":";
    return choices.split(splitter)[jsRandom(jsStrcount(choices, splitter))];
};

//try to find specified string within every single split inside given string, splitter can't be specified (don't need it now)
window.jsSplitcheck = function() {
	var n = 0;
    for (var i = 1; i < arguments.length; i++) {
		if (jsStrcount(arguments[0], "(^|:)(" + arguments[i] + ")($|:)")) n++;
	}
	return n
};

//find amount of occurrences within given string, supports regex
window.jsStrcount = function(str, search) {
	return (str.match(new RegExp(search, "g")) || []).length;
}

//count
window.jsCount = function(n) {
	if (n >= 11 && n <= 13) {
	    	return n + "th";
	    }
	    switch (n % 10) {
	    	case 1:  return n + "st";
	    	case 2:  return n + "nd";
	    	case 3:  return n + "rd";
	    	default: return n + "th";
	    }
};

//capitalize first letter of a given string
window.jsCapitalize = function(lower) {
    return lower.replace(/^\w/, c => c.toUpperCase());
};

//puts an appropriate article to the given string
window.jsArticle = function(str) {
/* exceptions, add on demand */
  if (str.toLowerCase().substring(0, 3) == "uni") return "a " + str;

  if (jsStrcount(str.toLowerCase(), "^[aeiouy]")) {
      return "an " + str;
  } else {
      return "a " + str;
  }
}






// following are used only by synonym finder widget <<fsyn>>



//check whether string is capitalized
window.jsCapCheck = function(str) {
	if (jsStrcount(str, "^[A-Z]")) return 1;
	return 0
};

//checks the occurrence at the end of the given word
//for multiple words use function bellow
//now that I know there's a built-in method in javascript exactly for this, I feel stupid
window.jsWordEndsIn = function() {
	var n = 0;
    for (var i = 1; i < arguments.length; i++) {
		if (jsStrcount(arguments[0], "^[^\\s]*(" + arguments[i] + ")(?=\\s|$)")) n++;
	}
	return n
};


//english present simple
window.jsVerbtSimple = function(str) {

if (jsWordEndsIn(str, "[^aeiou]y")) { /*;if last letter is "y" not preceded by a vowel, drop it and add "ies"*/
	str = str.replace(/(^[^\s]+[^aeiou])y(?=\s|$)/, "$1ies")
} else if (jsWordEndsIn(str, "x", "s", "ch", "sh", "o")) { /*;if word ends in "x", "s", "ss" "sh", "o" for does or "ch" add "es"*/
	str = str.replace(/(^[^\s]+)(?=\s|$)/, "$1es")
} else { /*;add "s"*/
	str = str.replace(/(^[^\s]+)(?=\s|$)/, "$1s")
}

return str
};
//english present continuous
window.jsVerbtContinuous = function(str) {

if ( jsWordEndsIn(str, "[^aieou][aeiou][^aeiouwxy]") && !jsWordEndsIn(str, "er", "en") ) { /*complicated to explain... CVC rule for doubling last letter*/
	str = str.replace(/(^[^\s]*[^aieou][aeiou]([^aeiouwxy]))(?=\s|$)/, "$1$2ing")
} else if (jsWordEndsIn(str, "ie")) { /*if word ends in "ie", drop and add "ying"*/
	str = str.replace(/(^[^\s]+)ie(?=\s|$)/, "$1ying")
} else if (jsWordEndsIn(str, "[^aeiou]e")) { /*if word ends in silent "e", drop and add "ing"*/
	str = str.replace(/(^[^\s]+[^aeiou])e(?=\s|$)/, "$1ing")
} else { /*add "ing"*/
	str = str.replace(/(^[^\s]+)(?=\s|$)/, "$1ing")
}

return str
};
//list of simple past irregular verbs for function below
window.jsIrregularVerbs = function(str) {
	switch (str){
	case "cum":
		return "came"
	case "awake":
		return "awoke"
	case "be":
		return "was"
	case "beat":
		return "beat"
	case "become":
		return "became"
	case "begin":
		return "began"
	case "bend":
		return "bent"
	case "bet":
		return "bet"
	case "bid":
		return "bid"
	case "bind":
		return "bound"
	case "bite":
		return "bit"
	case "bleed":
		return "bled"
	case "blow":
		return "blew"
	case "break":
		return "broke"
	case "breed":
		return "bred"
	case "bring":
		return "brought"
	case "build":
		return "built"
	case "burn":
		return "burnt"
	case "burst":
		return "burst"
	case "buy":
		return "bought"
	case "can":
		return "could"
	case "cast":
		return "cast"
	case "catch":
		return "caught"
	case "choose":
		return "chose"
	case "cling":
		return "clung"
	case "come":
		return "came"
	case "cost":
		return "cost"
	case "cut":
		return "cut"
	case "deal":
		return "dealt"
	case "dig":
		return "dug"
	case "do":
		return "did"
	case "draw":
		return "drew"
	case "drink":
		return "drank"
	case "drive":
		return "drove"
	case "eat":
		return "ate"
	case "fall":
		return "fell"
	case "feed":
		return "fed"
	case "feel":
		return "felt"
	case "fight":
		return "fought"
	case "find":
		return "found"
	case "flee":
		return "fled"
	case "fly":
		return "flew"
	case "forbid":
		return "forbade"
	case "forecast":
		return "forecast"
	case "forget":
		return "forgot"
	case "forsake":
		return "forsook"
	case "freeze":
		return "froze"
	case "get":
		return "got"
	case "give":
		return "gave"
	case "go":
		return "went"
	case "grind":
		return "ground"
	case "grow":
		return "grew"
	case "hang":
		return "hung"
	case "have":
		return "had"
	case "hear":
		return "heard"
	case "hide":
		return "hid"
	case "hit":
		return "hit"
	case "hold":
		return "held"
	case "hurt":
		return "hurt"
	case "keep":
		return "kept"
	case "kneel":
		return "knelt"
	case "know":
		return "knew"
	case "lay":
		return "laid"
	case "lead":
		return "led"
	case "leave":
		return "left"
	case "lend":
		return "lent"
	case "let":
		return "let"
	case "lie":
		return "lay"
	case "light":
		return "lit"
	case "lose":
		return "lost"
	case "make":
		return "made"
	case "may":
		return "might"
	case "mean":
		return "meant"
	case "meet":
		return "met"
	case "pay":
		return "paid"
	case "put":
		return "put"
	case "quit":
		return "quit"
	case "read":
		return "read"
	case "rid":
		return "rid"
	case "ride":
		return "rode"
	case "ring":
		return "rang"
	case "rise":
		return "rose"
	case "run":
		return "ran"
	case "say":
		return "said"
	case "see":
		return "saw"
	case "seek":
		return "sought"
	case "sell":
		return "sold"
	case "send":
		return "sent"
	case "set":
		return "set"
	case "shake":
		return "shook"
	case "shall":
		return "should"
	case "shed":
		return "shed"
	case "shoot":
		return "shot"
	case "shit":
		return "shat"
	case "shrink":
		return "shrank"
	case "shut":
		return "shut"
	case "sing":
		return "sang"
	case "sink":
		return "sank"
	case "sit":
		return "sat"
	case "slay":
		return "slew"
	case "sleep":
		return "slept"
	case "slide":
		return "slid"
	case "sling":
		return "slung"
	case "slit":
		return "slit"
	case "smite":
		return "smote"
	case "speak":
		return "spoke"
	case "speed":
		return "sped"
	case "spend":
		return "spent"
	case "spin":
		return "spun"
	case "spit":
		return "spat"
	case "split":
		return "split"
	case "spread":
		return "spread"
	case "spring":
		return "sprang"
	case "stand":
		return "stood"
	case "steal":
		return "stole"
	case "stick":
		return "stuck"
	case "sting":
		return "stung"
	case "stink":
		return "stank"
	case "stride":
		return "strode"
	case "strike":
		return "struck"
	case "string":
		return "strung"
	case "strive":
		return "strove"
	case "swear":
		return "swore"
	case "sweat":
		return "sweat"
	case "sweep":
		return "swept"
	case "swim":
		return "swam"
	case "swing":
		return "swung"
	case "take":
		return "took"
	case "teach":
		return "taught"
	case "tear":
		return "tore"
	case "tell":
		return "told"
	case "think":
		return "thought"
	case "throw":
		return "threw"
	case "thrust":
		return "thrust"
	case "tread":
		return "trod"
	case "understand":
		return "understood"
	case "wake":
		return "woke"
	case "wear":
		return "wore"
	case "weave":
		return "wove"
	case "weep":
		return "wept"
	case "wet":
		return "wet"
	case "win":
		return "won"
	case "wind":
		return "wound"
	case "wring":
		return "wrung"
	case "write":
		return "wrote"
	}
};
//english past simple
window.jsVerbtPast = function(str) {

if (jsIrregularVerbs(str)) { /*if word is an irregular verb, replace it, doesn't work correctly for multiple words atm*/
	str = str.replace(str, jsIrregularVerbs(str))
} else if ( jsWordEndsIn(str, "[^aieou][aeiou][^aeiouwxy]") && !jsWordEndsIn(str, "er", "en") ) { /*complicated to explain... CVC rule for doubling last letter*/
	str = str.replace(/(^[^\s]*[^aieou][aeiou]([^aeiouwxy]))(?=\s|$)/, "$1$2ed")
} else if (jsWordEndsIn(str, "[^aieou]y")) { /*if word ends in a consonant and "y", change it to "i" and add "ed"*/
	str = str.replace(/(^[^\s]+[^aeiou])y(?=\s|$)/, "$1ied")
} else if (jsWordEndsIn(str, "[aieou]", "ue", "oe", "ie")) { /*if word ends in vowel, add "d", not entirely correct, might need some tweaking*/
	str = str.replace(/(^[^\s]+)(?=\s|$)/, "$1d")
} else { /*add "ing"*/
	str = str.replace(/(^[^\s]+)(?=\s|$)/, "$1ed")
}

return str
};


//pluralizes given noun if plu is more than 1, works with multiple words, affecting the last
//can be capitalized
window.jsPlNoun = function(str, plu, cap) {
if (plu > 1) {
	var check = str.toLowerCase().replace(/^(?:a|an)\s/, "")
    var check = check.split(" ").pop() /* grab last element */
	switch (check){
	case "child":
		var output = "children"
		break;
	case "foot":
		var output = "feet"
		break;
	case "it":
		var output = "them"
		break;
	case "man":
		var output = "men"
		break;
	case "ovum":
		var output = "ova"
		break;
	case "person":
		var output = "people"
		break;
	case "that":
		var output = "those"
		break;
	case "this":
		var output = "these"
		break;
	case "tooth":
		var output = "teeth"
		break;
	case "woman":
		var output = "women"
		break;
	case "themself":
		var output = "themselves"
		break;
	default:
		if (!jsWordEndsIn(check, "kai", "ngu", "ami", "ama", "ppa", "jaku")) { /*many of these Japanese words don't have plural forms*/
			if (jsWordEndsIn(check, "[^aeiou]y")) { /*if last letter is "y" not preceded by a vowel, drop it and add "ies"*/
				var output = check.replace(/(^[^\s]+[^aeiou])y(?=\s|$)/, "$1ies")
			} else if (jsWordEndsIn(check, "[^f]f", "fe")) { /*if last letter is single "f" or "fe", replace with "ves"*/
				var output = check.replace(/(^[^\s]+)(?:fe|f)(?=\s|$)/, "$1ves")
			} else if (jsWordEndsIn(check, "x", "s", "ch", "sh")) { /*if word ends in "x", "s", "ss" "sh", or "ch" add "es"*/
				var output = check.replace(/(^[^\s]+)(?=\s|$)/, "$1es")
			} else {
				var output = check.replace(/(^[^\s]+)(?=\s|$)/, "$1s")
			}
		}
		break;
	}
	/* put everything back */
    var check = "";
    for (var i = 0; i < jsStrcount(str, " "); i++) {
		check += str.split(" ")[i] + " "
	}
    output = check + output
}

if (output) var str = output;

return (jsCapCheck(str) || cap) ? jsCapitalize(str) : str
};
