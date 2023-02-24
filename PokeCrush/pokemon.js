/*
Programmer: cruple396


Description: A basic Pokemon themed Candy Crush game. 
*/

var intervalID;

var pokemon = [
  "Gengar",
  "Venusaur",
  "Charizard",
  "Blastoise",
  "Pikachu",
  "Mewtwo",
];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var highScore = 750;
var turns = 20;
var level = 1;
var winner = false;
var currTile;
var otherTile;

window.onload = function () {
  launch();
  loadBoard();
};

function loop() {
  //1/10th of a second
  intervalID = window.setInterval(function () {
    crushPokemon();
    slidePokemon();
    generatePokemon();
    checkTurn();
  }, 100);
}

//picks a random name from pokemon based on the returned number
function randomPokemon() {
  return pokemon[Math.floor(Math.random() * pokemon.length)]; //0 - 5.99
}

//generates a tile with the random pokemon from randomPokemon()
function generatePokemon() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomPokemon() + ".png";
    }
  }
}

//slides pokemon down the board
function slidePokemon() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = columns - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[ind][c].src = board[r][c].src;
        ind -= 1;
      }
    }

    for (let r = ind; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

function loadBoard() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // <img id="0-0" src="./images/Gengar.png">
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomPokemon() + ".png";

      //DRAG FUNCTIONALITY
      tile.addEventListener("dragstart", dragStart); //click on a pokemon, initialize drag process
      tile.addEventListener("dragover", dragOver); //clicking on pokemon, moving mouse to drag the pokemon
      tile.addEventListener("dragenter", dragEnter); //dragging pokemon onto another pokemon
      tile.addEventListener("dragleave", dragLeave); //leave pokemon over another pokemon
      tile.addEventListener("drop", dragDrop); //dropping a pokemon over another pokemon
      tile.addEventListener("dragend", dragEnd); //after drag process completed, swap pokemon

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

//Changes to the main game screen and sets the turns and score
function startGame() {
  if(winner==true){
    highScore+=100;
    level+=1;
    document.getElementById("highScoreEnd").innerText = highScore;
  }
  else{
    highScore=750;
    level=1;
    document.getElementById("highScoreEnd").innerText = highScore;
  }
  let startDiv = document.getElementById("start");
  let gameHeading = document.getElementById("heading");
  let gameBoard = document.getElementById("board");
  let gameOver = document.getElementById("game-over");
  let endHead = document.getElementById("end-heading");

  document.getElementById("level").innerText = level;
  startDiv.style.display = "none";
  gameBoard.style.display = "flex";
  gameHeading.style.display = "inline-flex";
  gameOver.style.display = "none";
  endHead.style.display = "none";

  score = 0;
  turns = 20;
  loop();
}

//Checks for the final turn
function checkTurn() {
  if (turns == 0) {
    //wait 1 second then uses gameOver function
    setTimeout(gameOver, 1000);
  }
}

//Switches the main page and displays highScore and score
function gameOver() {
  let startDiv = document.getElementById("start");
  let gameHeading = document.getElementById("heading");
  let gameBoard = document.getElementById("board");
  let gameOver = document.getElementById("game-over");
  let endHead = document.getElementById("end-heading");

  startDiv.style.display = "none";
  gameBoard.style.display = "none";
  gameHeading.style.display = "none";
  gameOver.style.display = "block";
  endHead.style.display = "inline-flex";

  clearInterval(intervalID);

  //If score is higher than highScore, set end title and button text to win
  if (score > highScore) {
    document.getElementById("ending").innerText = "Level Completed";
    document.getElementById("button").innerText = "Next Level";
    winner=true;
  }
  //else, set end title and button text to lose
  else{
    document.getElementById("ending").innerText = "Game Over";
    document.getElementById("button").innerText = "Play Again";
    winner=false;
  }
  document.getElementById("levelEnd").innerText = level;
  document.getElementById("highScoreEnd").innerText = highScore;
  document.getElementById("scoreEnd").innerText = score;
}

function launch() {
  let startDiv = document.getElementById("start");
  let gameHeading = document.getElementById("heading");
  let gameBoard = document.getElementById("board");
  let gameOver = document.getElementById("game-over");
  let endHead = document.getElementById("end-heading");

  startDiv.style.display = "block";
  gameBoard.style.display = "none";
  gameHeading.style.display = "none";
  gameOver.style.display = "none";
  endHead.style.display = "none";

  document.getElementById("highScore").innerText = highScore;
}

//Dragging tile functions
function dragStart() {
  //tile that was clicked on for dragging
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  //tile that was dropped on
  otherTile = this;
}

function dragEnd() {
  if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }
  //End of dragging functions

  //gets the coords of the current tile and saves the row into r and column into c
  let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  //gets the coords of the current tile and saves the row into r2 and column into c2
  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 == c - 1 && r == r2;
  let moveRight = c2 == c + 1 && r == r2;

  let moveUp = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  //checks to see if the current and other tile are adjacent.
  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    turns -= 1;

    let validMove = checkValid();
    if (!validMove) {
      let currImg = currTile.src;
      let otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;
      turns += 1;
    }
  }
}

function checkValid() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r][c + 1];
      let pokemon3 = board[r][c + 2];

      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        !pokemon1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r + 1][c];
      let pokemon3 = board[r + 2][c];

      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        !pokemon1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  return false;
}

function crushPokemon() {
  crushFive();
  crushFour();
  crushThree();
  document.getElementById("score").innerText = score;
  document.getElementById("turns").innerText = turns;
  document.getElementById("highScore").innerText = highScore;
}

function crushThree() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r][c + 1];
      let pokemon3 = board[r][c + 2];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        score += 30;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r + 1][c];
      let pokemon3 = board[r + 2][c];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        score += 30;
      }
    }
  }
}

function crushFour() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r][c + 1];
      let pokemon3 = board[r][c + 2];
      let pokemon4 = board[r][c + 3];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        pokemon3.src == pokemon4.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        pokemon4.src = "./images/blank.png";
        score += 40;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r + 1][c];
      let pokemon3 = board[r + 2][c];
      let pokemon4 = board[r + 3][c];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        pokemon3.src == pokemon4.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        pokemon4.src = "./images/blank.png";
        score += 40;
      }
    }
  }
}

function crushFive() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 4; c++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r][c + 1];
      let pokemon3 = board[r][c + 2];
      let pokemon4 = board[r][c + 3];
      let pokemon5 = board[r][c + 4];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        pokemon3.src == pokemon4.src &&
        pokemon4.src == pokemon5.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        pokemon4.src = "./images/blank.png";
        pokemon5.src = "./images/blank.png";
        score += 50;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 4; r++) {
      let pokemon1 = board[r][c];
      let pokemon2 = board[r + 1][c];
      let pokemon3 = board[r + 2][c];
      let pokemon4 = board[r + 3][c];
      let pokemon5 = board[r + 4][c];
      if (
        pokemon1.src == pokemon2.src &&
        pokemon2.src == pokemon3.src &&
        pokemon3.src == pokemon4.src &&
        pokemon4.src == pokemon5.src &&
        !pokemon1.src.includes("blank")
      ) {
        pokemon1.src = "./images/blank.png";
        pokemon2.src = "./images/blank.png";
        pokemon3.src = "./images/blank.png";
        pokemon4.src = "./images/blank.png";
        pokemon5.src = "./images/blank.png";
        score += 50;
      }
    }
  }
}
