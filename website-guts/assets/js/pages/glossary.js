var alphabet = $('#alphabet').text();

var buildTOCandSortedPage = function() {
  
  //first gather all terms that are on page. terms may be in any of our languages.
  var termsElements = $('.term-container');
  
  //build object with term and summarykey: "value",             
  //key is string, value is the <p>  html element with summary of term
  var terms = {};
  for (var i = 0; i < termsElements.length; i++){
    var term = $.text(termsElements[i].children[0]);
    var summary = termsElements[i].children[1];
    terms[term] = summary;
  }

  //now we need to sort terms. objects are by definition unsorted, so let's grab all terms in an array
  //and sort them in a case-insensitive way
  var sortedTermsList = Object.keys(terms).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  //build alphabet hash
  var alphabetHash = {};
  for (var j = 0; j < alphabet.length; j++){
    var letter = alphabet[j];
    alphabetHash[letter] = 0;
  }

  //see which letters are present in our terms
  for (var k = 0; k < sortedTermsList.length; k++){
    var firstLetter = sortedTermsList[k].charAt(0).toUpperCase();
    alphabetHash[firstLetter] += 1;
  }

  //clear page to then rebuild
  $('.glossary-container').empty();

  //add headers for each letter
  for (var prop in alphabetHash) {
    if (alphabetHash[prop] !== 0) {
      var newIndexHeadline = '<h1>' + prop + '</h1>';
      var newIndexContainer = $('<div class="index-container"></div>').attr('id', '' + prop).append(newIndexHeadline);
      $('.glossary-container').append(newIndexContainer);
    }
  }

  //add terms and summaries under appropriate letter headline
  for (var l = 0; l < sortedTermsList.length; l++) {
    var currentTerm = sortedTermsList[l];
    var termHeadline = $('<h4>' + currentTerm + '</h4>');
    var termSummary = terms[currentTerm];
    //definition is a term as a headline and its corresponding paragraph summary
    var newDefinition = $('<div class="term-container"></div>').append(termHeadline).append(termSummary);

    //find definition's first character to find where to add it to the page
    var nestUnder = sortedTermsList[l].charAt(0).toUpperCase();
    $('#' + nestUnder).append(newDefinition);
  }

  //build table of contents (toc) 
  var toc = $('<div class="flex justify-content--space-between toc-container"></div>');
  for (var letterInAlphabet in alphabetHash){
    var newTOCletter = $('<span class="toc-index">' + letterInAlphabet + '</span>');
    //create link if we have a word starting with that letters
    if (alphabetHash[letterInAlphabet] !== 0){
      var newAnchorLink = $('<a smooth-scroll></a>').attr('href', '#' + letterInAlphabet);
      newTOCletter.wrapInner(newAnchorLink);
    }
    toc.append(newTOCletter);
  }

  //add table of contents to top of the page
  $('.glossary-container').prepend(toc);

  //add smooth scrolling to all the links with smooth-scroll attribute
  $('[smooth-scroll]').on('click', w.optly.mrkt.utils.smoothScroll);
};

//on page load, check to see if there is an alphabet used to build TOC and letter-headers. 
//If not, such as for our Japanese page in this v1.0 of this glossary page, the page will merely present all definitions in the order they are entered into glossary.yml
$(function(){
  if (alphabet) { buildTOCandSortedPage(); }
});
