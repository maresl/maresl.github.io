//Global Constants 
const ROW = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]
const COLUMN = [`8`, `7`, `6`, `5`, `4`, `3`, `2`, `1`]
const BOARD = []
let WHITES_TURN
const GRAVEYARD = []
const WHITE_ARMY = []
let W_KING
const BLACK_ARMY = []
let B_KING
let GAME_OVER

//superclass for all chess pieces
//saves the color of the piece, it's location as coordinates, 
//and whether the piece is in play
//behavior: place the piece on the board, move it if the player clicks on
//a valid square, and moves the piece to the graveyard if it is captured
class Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        this.color = color   //`WHITE` or `BLACK`
        this.currentXPosition = startXPosition
        this.currentYPosition = startYPosition
        this.placeHolder = placeHolder
        this.inPlay = true
    }

    place(){
        BOARD[this.currentYPosition][this.currentXPosition] = this
    }

    move(square){
        const validSquares = this.validMoves()
        if(validSquares.indexOf(square) > -1){
            this.captureOppenent(square)
            BOARD[this.currentYPosition][this.currentXPosition] = null
            this.currentXPosition = ROW.indexOf(square.charAt(0))
            this.currentYPosition = COLUMN.indexOf(square.charAt(1))
            this.place()
        } else {
            alert(`invalid move`)
        }
    }

    captureOppenent(square){
        const currentState = getSquare(square)
        if(currentState !== null){
            currentState.captured()
        }
    }

    //this is a test case - override for each type of chess piece
    validMoves() {
        const validMoves = []
        return validMoves
    }

    captured(){
        this.inPlay = false
        if(isWhite(this)){
            WHITE_ARMY.splice(WHITE_ARMY.indexOf(this), 1)
            console.log(WHITE_ARMY)
        } else {
            BLACK_ARMY.splice(BLACK_ARMY.indexOf(this), 1)
            console.log(BLACK_ARMY)
        }
        GRAVEYARD.push(this)
        console.log(GRAVEYARD)
    }

    isOpponent(piece){
        return piece.color !== this.color
    }

    placeHolderPrefix(){
        if(this.color === `WHITE`){
            return `W`
        } else {
            return `B`
        }
    }

    addToValidMoves(validMoves, x, y) {
        if(validIndex(x) && validIndex(y)){
            const currentState = getSquare(ROW[x] + COLUMN[y])
            if(currentState === null || this.isOpponent(currentState)){
                validMoves.push(ROW[x] + COLUMN[y])
            }
        }
    }

    pathOfValidMoves(validMoves, xPosition, xIncrement, yPosition, yIncrement){
        let x = xPosition + xIncrement
        let y = yPosition + yIncrement
        if(!(validIndex(x) && validIndex(y))){
            return
        }
        const currentState = getSquare(ROW[x] + COLUMN[y])
        if(currentState !== null){
            if(this.isOpponent(currentState)){
                validMoves.push(ROW[x] + COLUMN[y])
            }
            return
        }
        validMoves.push(ROW[x] + COLUMN[y])
        this.pathOfValidMoves(validMoves, x, xIncrement, y, yIncrement)
        //cases: empty square, square with ally, square with enemy, invalid square
    }

    squareName(){
        return ROW[this.currentXPosition] + COLUMN[this.currentYPosition]
    }

}

//Pawns inherit the behavior of all chess pieces but can only move forward 
//pawns can move forward two squares if it is the piece's first move 
//and only one square every turn after that
//it is able to capture any pieces diagonal to it
class Pawn extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder){
        super(color, startXPosition, startYPosition, placeHolder)
        this.firstMove = true
    }

    validMoves() {
        const validMoves = []
        const increment = getIncrement(this.color)
        let y = this.currentYPosition + increment
        this.addToForwardValidMoves(validMoves, this.currentXPosition, y)
        
        //special case: opponent piece is diagonal to pawn
        const xRight = this.currentXPosition + 1
        const xLeft = this.currentXPosition - 1
        this.addToDiagonalValidMoves(validMoves, xRight, y)
        this.addToDiagonalValidMoves(validMoves, xLeft, y)
        
        //special case: first move
        if(this.firstMove){
            y = this.currentYPosition + (increment * 2)
            this.addToForwardValidMoves(validMoves, this.currentXPosition, y)
        }
        return validMoves
    }

    addToForwardValidMoves(validMoves, x, y) {
        if(validIndex(x) && validIndex(y)){
            const currentState = getSquare(ROW[x] + COLUMN[y])
            if(currentState === null){
                validMoves.push(ROW[x] + COLUMN[y])
            }
        }
    }

    addToDiagonalValidMoves(validMoves, x, y) {
        if(validIndex(x) && validIndex(y)){
            const currentState = getSquare(ROW[x] + COLUMN[y])
            if(currentState !== null && this.isOpponent(currentState)){
                validMoves.push(ROW[x] + COLUMN[y])
            }
        }
    }

    move(square){
        super.move(square)
        this.firstMove = false
    }
}

//Knights inherit the behavior of all chess pieces 
//they are able to move 2 spaces perpendicular and  
//one space the side on every turn
class Knight extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        super(color, startXPosition, startYPosition, placeHolder)
    }

    validMoves(){
        const validMoves = []
        this.addToValidMoves(validMoves, this.currentXPosition + 2, this.currentYPosition + 1)
        this.addToValidMoves(validMoves, this.currentXPosition + 2, this.currentYPosition - 1)
        this.addToValidMoves(validMoves, this.currentXPosition - 2, this.currentYPosition + 1)
        this.addToValidMoves(validMoves, this.currentXPosition - 2, this.currentYPosition - 1)
        this.addToValidMoves(validMoves, this.currentXPosition + 1, this.currentYPosition + 2)
        this.addToValidMoves(validMoves, this.currentXPosition - 1, this.currentYPosition + 2)
        this.addToValidMoves(validMoves, this.currentXPosition + 1, this.currentYPosition - 2)
        this.addToValidMoves(validMoves, this.currentXPosition - 1, this.currentYPosition - 2)
        return validMoves
    }
}

//Bishop inherits the behavior of all chess pieces
//is able to move diagonally forwards and backwards
class Bishop extends Piece{
    constructor(color, startXPosition, startYPosition, placeHolder) {
        super(color, startXPosition, startYPosition, placeHolder)
    }

    validMoves(){
        const validMoves = []
        this.pathOfValidMoves(validMoves, this.currentXPosition, 1, this.currentYPosition, 1)
        this.pathOfValidMoves(validMoves, this.currentXPosition, 1, this.currentYPosition, -1)
        this.pathOfValidMoves(validMoves, this.currentXPosition, -1, this.currentYPosition, 1)
        this.pathOfValidMoves(validMoves, this.currentXPosition, -1, this.currentYPosition, -1)
        return validMoves
    }
}

//Rook inherits the behavior for all chess pieces and 
//can move in a straight line 
class Rook extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        super(color, startXPosition, startYPosition, placeHolder)
    }

    validMoves(){
        const validMoves = []
        this.pathOfValidMoves(validMoves, this.currentXPosition, 1, this.currentYPosition, 0)
        this.pathOfValidMoves(validMoves, this.currentXPosition, -1, this.currentYPosition, 0)
        this.pathOfValidMoves(validMoves, this.currentXPosition, 0, this.currentYPosition, 1)
        this.pathOfValidMoves(validMoves, this.currentXPosition, 0, this.currentYPosition, -1)
        return validMoves
    }
}

//Queen inherits the behavior for all chess pieces and 
//can move in a straight line 
class Queen extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        super(color, startXPosition, startYPosition, placeHolder)
    }

    validMoves(){
        const validMoves = []
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                this.pathOfValidMoves(validMoves, this.currentXPosition, i, this.currentYPosition, j)
            }
        }
        return validMoves
    }
}

//King inherits the behavior of all chess pieces
//it is able to move one square in any direction
class King extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        super(color, startXPosition, startYPosition, placeHolder)
    }

    validMoves(){
        const validMoves = []
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                this.addToValidMoves(validMoves, this.currentXPosition + i, this.currentYPosition + j)
            }
        }
        return validMoves
    }

    captured(){
        super.captured()
        GAME_OVER = true;
    }
}







//Game 



//creates a new board if it has not been initialized before
//empties the board if reseting for a new game
function intiateBoard() {
    if(BOARD.length > 0){
        BOARD.length = 0
    }
    for (let i = 0; i < 8; i++){
        let newRow = []
        for (let i = 0; i < 8; i++){
            newRow.push(null)
        }
        BOARD.push(newRow)
    }
}

//creates the white player's chess pieces and places them in the correct board squares 
function initiateArmy (army, color, row, piecesArray){
    if (army.length > 0){
        army.length = 0
    }
    
    army.push(new Rook(color, 0, row, piecesArray[1]))
    army.push(new Knight(color, 1, row, piecesArray[2]))
    army.push(new Bishop(color, 2, row, piecesArray[3]))
    army.push(new Queen(color, 3, row, piecesArray[4]))
    const king = new King(color, 4, row, piecesArray[5])
    army.push(king)
    army.push(new Bishop(color, 5, row, piecesArray[3]))
    army.push(new Knight(color, 6, row, piecesArray[2]))
    army.push(new Rook(color, 7, row, piecesArray[1]))

    const pawnRow = row + getIncrement(color)
    for (let i = 0; i <= 7; i++){
        army.push(new Pawn(color, i, pawnRow, piecesArray[0]))
    }
    placeArmy(army)
    return king

}

function getWhitePieces(){
    return [`<img class="chess_piece" src="./images/WPawn.svg"></div>`,
            `<img class="chess_piece" src="./images/WRook.svg"></div>`,
            `<img class="chess_piece" src="./images/WKnight.svg"></div>`, 
            `<img class="chess_piece" src="./images/WBishop.svg"></div>`,
            `<img class="chess_piece" src="./images/WQueen.svg"></div>`, 
            `<img class="chess_piece" src="./images/WKing.svg"></div>`]
}

function getBlackPieces(){
    return [`<img class="chess_piece" src="./images/BPawn.svg"></div>`,
            `<img class="chess_piece" src="./images/BRook.svg"></div>`,
            `<img class="chess_piece" src="./images/BKnight.svg"></div>`, 
            `<img class="chess_piece" src="./images/BBishop.svg"></div>`,
            `<img class="chess_piece" src="./images/BQueen.svg"></div>`, 
            `<img class="chess_piece" src="./images/BKing.svg"></div>`]
}

//places army on the board
function placeArmy(army){
    army.forEach(piece => {
        piece.place()
    });
}

//intitates a game board with armies
function intitateGame() {
    intiateBoard()
    W_KING = initiateArmy(WHITE_ARMY, `WHITE`, 7, getWhitePieces())
    B_KING = initiateArmy(BLACK_ARMY, `BLACK`, 0, getBlackPieces())
    GRAVEYARD.length = 0
    WHITES_TURN = true
    GAME_OVER = false
    updatePlayer()
}

//updates player's turn
function updateTurn() {
    WHITES_TURN =  !WHITES_TURN
    updatePlayer()
    updateCheck()
}

function updatePlayer(){
    const $player = $(`#player_turn`)
    if(GAME_OVER){
        $player.text(`Game over!`)
    } else if(WHITES_TURN){
        $player.text(`It is White's turn to move`)
    } else {
        $player.text(`It is Black's turn to move`)
    }
}

//returns 
function getIncrement(color){
    if(color === `WHITE`){
        return -1
    } else {
        return 1
    }
}

//takes a square as a parameter and returns null if the square is empty
//or the chess piece that current sits in the square
function getSquare(square) {
    return BOARD[COLUMN.indexOf(square.charAt(1))][ROW.indexOf(square.charAt(0))]
}

//takes an index 
//returns true if the index is part of the board dimensions
function validIndex(n){
    return n >= 0 && n <= 7
}

//places visual representation of board on user's screen
function drawBoard(){
    BOARD.forEach( row => {
        row.forEach( square => {
            if(square !== null){
                $(`#${square.squareName()}`).html(`${square.placeHolder}`)
            }
        })
    })
}

function isWhite(piece){
    return piece.color === `WHITE`
}

function updateCheck(){
    kingInCheck(W_KING, BLACK_ARMY)
    kingInCheck(B_KING, WHITE_ARMY)
}

function kingInCheck(king, enemyArmy){
    $(`.container .king_in_check`).removeClass(`king_in_check`)
    const squareId = king.squareName()
    if(enemyHasAccess(squareId, enemyArmy)){
        $(`#${squareId}`).addClass(`king_in_check`)
    } 
}

function enemyHasAccess(squareId, enemyArmy){
    let found = false
    enemyArmy.forEach(enemy => {
        const enemyMoves = enemy.validMoves()
        if(enemyMoves.indexOf(squareId) > -1){
            found = true
        }
    })
    return found
}

//CALLS



intitateGame()
drawBoard()

//listener for click
$(`.col`).on(`click`, handleBoardClick)

function handleBoardClick(e){
    e.preventDefault()
    const squareId = e.target.id
    const $square = $(`#${squareId}`)
    if($square.hasClass(`valid_square`)){
        const $selectedSquare = $(`.select`)
        $selectedSquare.text(``)
        const piece = getSquare($selectedSquare.attr(`id`))
        piece.move(squareId)
        removeHighlights()
        drawBoard()
        updateTurn()
    } else {
        removeHighlights()
        const square = getSquare(squareId)
        if(square !== null && ((isWhite(square) && WHITES_TURN) || (!isWhite(square) && !WHITES_TURN))){
            $square.addClass(`select`)
            const possibleMoves = square.validMoves()
            possibleMoves.forEach(validSquare => {
                $(`#${validSquare}`).addClass(`valid_square`)
            })
        }
    }
}

function removeHighlights(){
    $(`.container .select`).removeClass(`select`)
    $(`.container .valid_square`).removeClass(`valid_square`)
}


console.log(BOARD)



