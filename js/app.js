/*
 * App's JavaScript code
 */

const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let started = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let timerPtr;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function getClassFromCard(card){
    return card[0].firstChild.className;
}

// check open cards when count = 2
function checkOpenCards(){
    if (getClassFromCard(openCards[0]) === getClassFromCard(openCards[1])){
        console.log("matched");
        openCards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        console.log("not matched");
        openCards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
}

function startTimer(){
    timeCount += 1;
    $("#timer").html(timeCount);
    timerPtr = setTimeout(startTimer, 1000);
}

// increment move count
function incrementMove(){
    moves += 1;
    $("#moves").html(moves);
}

// event handler for when the card is clicked
function cardClick(event){
    if (!started) {
        started = true;
        timeCount = 0;
        timerPtr = setTimeout(startTimer, 1000);
        // TODO: timer
    }
    // cards can be flipped
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    // check if cards match
    if (openCards.length === 2){
        checkOpenCards();
    }
}

// create individual card element
function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function populateCards(){
    shuffle(cardList).forEach(createCard);
    shuffle(cardList).forEach(createCard);
}

function resetGame(){
    $("ul.deck").html("");
    moves = -1;
    incrementMove();
    started = false;
    openCards = [];
    timeCount = 0;
    clearTimeout(timerPtr);
    $("#timer").html(0);
    // re-setup game
    initGame();
}

function initGame(){
    populateCards();
    $(".card").click(cardClick);
}

// start the game
$(document).ready(function(){
    initGame();
    $("#restart").click(resetGame);
});

// load animateCss
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});
