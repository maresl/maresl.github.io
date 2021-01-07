//Global Constants 
const ROW = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]
const COLUMN = [`8`, `7`, `6`, `5`, `4`, `3`, `2`, `1`]
const BOARD = []
let WHITES_TURN = true
const GRAVEYARD = []

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
        this.placeHolder = this.placeHolderPrefix() + placeHolder
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
            updateTurn()
        } else {
            alert(`invalid move`)
        }
    }

    captureOppenent(square){
        const currentState = getSquare(square)
        if(currentState !== null){
            currentState.captured()
            GRAVEYARD.push(currentState)
        }
    }

    //this is a test case - override for each type of chess piece
    validMoves() {
        const validMoves = []
        if(this.currentYPosition <= 6){
            validMoves.push(ROW[this.currentXPosition] + COLUMN[this.currentYPosition + 1])
        }
        if(this.currentYPosition >= 1){
            validMoves.push(ROW[this.currentXPosition] + COLUMN[this.currentYPosition - 1])
        }
        if(this.currentXPosition <= 6){
            validMoves.push(ROW[this.currentXPosition + 1] + COLUMN[this.currentYPosition])
        }
        if(this.currentXPosition >= 1){
            validMoves.push(ROW[this.currentXPosition - 1] + COLUMN[this.currentYPosition])
        }
        return validMoves
    }

    captured(){
        this.inPlay = false
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

    toString(){
        return this.placeHolder
    }
}


//Pawns inherit the behavior of all chess pieces but can only move forward 
//pawns can move forward two squares if it is the piece's first move 
//and only one square every turn after that
//it is able to capture any pieces diagonal to it
class Pawn extends Piece {
    constructor(color, startXPosition, startYPosition){
        super(color, startXPosition, startYPosition, `P`)
        this.firstMove = true
    }

    validMoves() {
        const validMoves = []
        const increment = this.getIncrement()
        let y = this.currentYPosition + increment
        this.addToValidMoves(validMoves, this.currentXPosition, y)
        
        //special case: opponent piece is diagonal to pawn
        const xRight = this.currentXPosition + 1
        const xLeft = this.currentXPosition - 1
        this.addToDiagonalValidMoves(validMoves, xRight, y)
        this.addToDiagonalValidMoves(validMoves, xLeft, y)
        
        //special case: first move
        if(this.firstMove){
            y = this.currentYPosition + (increment * 2)
            this.addToValidMoves(validMoves, this.currentXPosition, y)
        }
        return validMoves
    }

    getIncrement(){
        if(this.color === `WHITE`){
            return -1
        } else {
            return 1
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
    constructor(color, startXPosition, startYPosition) {
        super(color, startXPosition, startYPosition, `N`)
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

//updates player's turn
function updateTurn() {
    WHITES_TURN =  !WHITES_TURN
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

//CALLS
//validMoves.push(ROW[x] + COLUMN[y])

intiateBoard()
const firstPiece = new Knight(`WHITE`, 1, 3)
firstPiece.place()
const secondPiece = new Knight(`WHITE`, 3, 4)
secondPiece.place()
console.log(getSquare(`B5`))
console.log(BOARD)
console.log(firstPiece.validMoves())


