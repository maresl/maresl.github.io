//test console.log("hello!")

//Global Constants 
const ROW = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]
const COLUMN = [`8`, `7`, `6`, `5`, `4`, `3`, `2`, `1`]
const BOARD = []
const WHITE = []
const BLACK = []

class Piece {
    constructor(color, startXPosition, startYPosition, placeHolder) {
        this.color = color
        this.currentXPosition = startXPosition
        this.currentYPosition = startYPosition
        this.placeHolder = placeHolder
        this.inPlay = true
    }

    place(){
        BOARD[this.currentYPosition][this.currentXPosition] = this.placeHolder
    }

    move(x, y){
        BOARD[this.currentYPosition][this.currentXPosition] = null
        this.currentXPosition += x
        this.currentYPosition += y
        this.place()
    }

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
}



class Pawn extends Piece {
    constructor(color, startXPosition, startYPosition, placeHolder){
        super(color, startXPosition, startYPosition, placeHolder)
        this.firstMove = true
    }

    validMoves() {
        return[]
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


//CALLS
intiateBoard()
const firstPiece = new Piece(`WHITE`, 0, 0, `WQ`)

