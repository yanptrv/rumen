import React, {useEffect, useState} from "react";

let board = Array.from(Array(8), () => new Array(8));

let flag = true;
let flagForMove = false;
let piece = '';
let blackOrWhite = '';
let didLoad = false;
let oldX = '';
let oldY = '';
let blackKingNotMoved = true;
let whiteKingNotMoved = true;
let blackRook1NotMoved = true;
let blackRook2NotMoved = true;
let whiteRook1NotMoved = true;
let whiteRook2NotMoved = true;
let whiteKingMustMove = false;
let blackKingMustMove = false;
let code = ''


export default function Chessboard() {

    const [jsxBoard, setJSXBoard] = useState(
        Array.from(Array(8), () => new Array(8))
    );

    const heckForCheck = (colorFirstLetter) => {
        let kingX;
        let kingY;
        if (colorFirstLetter === 'w') {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if (board[y][x] === 'bK') {
                        kingX = x;
                        kingY = y;
                    }
                }
            }
        } else if (colorFirstLetter === 'b') {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if (board[y][x] === 'wK') {
                        kingX = x;
                        kingY = y;
                    }
                }
            }
        }
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (board[y][x].charAt(0) === colorFirstLetter) {
                    oldX = x;
                    oldY = y;
                    if (rulesOfChess(kingY, kingX, board[kingY][kingX])) {
                        if (colorFirstLetter === 'b') {
                            blackKingMustMove = true;
                        } else if (colorFirstLetter === 'w') {
                            whiteKingMustMove = true;
                        }
                    }
                }
            }
        }
    }


    // moving pieces from one note to another
    // moving them through the board array and placing them into the jsx board

    const redirect = (y, x) => {

        //checking for white or black to move

        if (flagForMove) {
            blackOrWhite = 'black'
        } else {
            blackOrWhite = 'white'
        }

        if (flag) {

            //removing the piece and saving its coordinates

            if (board[y][x] != null) {
                piece = board[y][x];
                board[y][x] = null;
                oldX = x;
                oldY = y;
                flag = false;
            }
        } else {

            //checking if the move is legal, if not returning it to its original place

            if (rulesOfChess(y, x, board[y][x])) {
                board[y][x] = piece;
                const sendPOST = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        personToMove: blackOrWhite,
                        board: boardToFEN(),
                        code: code,
                    }),
                };
                fetch('/api/create', sendPOST);
            } else
                board[oldY][oldX] = piece;

            flag = true;

        }

        setJSXBoard(board);

    }

    const rulesOfChess = (y, x, newTile) => {


        //checking if there are pieces when moving horizontally or vertically

        const travelThroughPiece = () => {
            if (y !== oldY && x === oldX) {
                if (y > oldY) {
                    for (let i = y - 1; i > oldY; i--) {
                        if (board[i][x] !== null) {
                            return true;
                        }
                    }
                } else if (y < oldY) {
                    for (let i = y + 1; i < oldY; i++) {
                        if (board[i][x] !== null) {
                            return true;
                        }
                    }
                }
            } else if (x !== oldX && y === oldY) {
                if (x > oldX) {
                    for (let i = x - 1; i > oldX; i--) {
                        if (board[y][i] !== null) {
                            return true;
                        }
                    }
                } else if (x < oldX) {
                    for (let i = x + 1; i < oldX; i++) {
                        if (board[y][i] !== null) {
                            return true;
                        }
                    }
                }
            }
            return false
        }

        if (piece.charAt(0) === blackOrWhite.charAt(0)) {
            if (piece.charAt(0) === 'w') {
                if (newTile != null) {
                    if (newTile.charAt(1) === 'K') {
                        return false;
                    }
                    if (newTile.charAt(0) === 'w') {
                        return false;
                    }
                }
                if (whiteKingMustMove) {
                    if (piece.charAt(1) !== 'K') {
                        return false;
                    }
                }

                switch (piece.charAt(1)) {
                    case 'P':
                        if (travelThroughPiece()) {
                            return false;
                        }
                        if (oldY === 6) {
                            if (y !== 4 && y !== 5) {
                                return false;
                            }
                        } else {
                            if (oldY - y !== 1) {
                                return false;
                            }
                        }
                        if (newTile != null) {
                            if (x !== oldX + 1 && x !== oldX - 1 && oldY || oldY - y !== 1) {
                                return false;
                            }

                        } else {
                            if (x !== oldX)
                                return false;
                        }
                        if (y === 0) {
                            piece = 'wQ';
                        }
                        break;
                    case 'R':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (travelThroughPiece()) {
                            return false;
                        }
                        if (x !== oldX && y !== oldY) {
                            return false;
                        }
                        if (x === 0 && whiteRook1NotMoved) {
                            whiteRook1NotMoved = false;
                        } else if (x === 7 && whiteRook2NotMoved) {
                            whiteRook2NotMoved = false;
                        }
                        break;
                    case 'N':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (y + 2 === oldY || y - 2 === oldY) {
                            if (x + 1 !== oldX && x - 1 !== oldX) {
                                return false;
                            }
                        } else if (y + 1 === oldY || y - 1 === oldY) {
                            if (x + 2 !== oldX && x - 2 !== oldX) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    case 'K':
                        if (x + 2 === oldX) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            if (whiteRook1NotMoved) {
                                if (whiteKingNotMoved) {
                                    board[7][0] = null;
                                    board[y][x + 1] = 'wR';
                                    whiteKingNotMoved = false;
                                    whiteRook1NotMoved = false;
                                    break;
                                }
                            }
                        } else if (x - 2 === oldX) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            if (whiteRook2NotMoved) {
                                if (whiteKingNotMoved) {
                                    board[7][7] = null;
                                    board[y][x - 1] = 'wR';
                                    whiteKingNotMoved = false;
                                    whiteRook2NotMoved = false;
                                    break;
                                }
                            }
                        }
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (y + 1 !== oldY && y - 1 !== oldY && y !== oldY) {
                            return false;
                        }
                        if (x + 1 !== oldX && x - 1 !== oldX && x !== oldX) {
                            return false;
                        }
                        if (whiteKingNotMoved) {
                            whiteKingNotMoved = false;
                        }
                        if (board[y][x + 1] === 'bK' || board[y][x - 1] === 'bK') {
                            return false;
                        } else if (board[y + 1][x] === 'bK' || board[y - 1][x] === 'bK') {
                            return false;
                        } else if (board[y + 1][x + 1] === 'bK' || board[y + 1][x - 1] === 'bK') {
                            return false;
                        } else if (board[y - 1][x + 1] === 'bK' || board[y - 1][x - 1] === 'bK') {
                            return false;
                        }
                        break;
                    case 'B':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (Math.abs(x - oldX) !== Math.abs(y - oldY)) {
                            return false;
                        }
                        if (y < oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX + i] !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 'Q':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (x === oldX && y !== oldY) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            break;
                        }
                        if (x !== oldX && y === oldY) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            break;
                        }
                        if (Math.abs(x - oldX) !== Math.abs(y - oldY)) {
                            return false;
                        }
                        if (y < oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX + i] !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                        break;

                }
            } else if (piece.charAt(0) === 'b') {
                if (newTile != null) {
                    if (newTile.charAt(0) === 'b') {
                        return false;
                    }
                    if (newTile.charAt(1) === 'K') {
                        return false;
                    }
                }
                if (blackKingMustMove) {
                    if (piece.charAt(1) !== 'K') {
                        return false;
                    }
                }

                switch (piece.charAt(1)) {
                    case 'P':
                        if (travelThroughPiece()) {
                            return false;
                        }
                        if (oldY === 1) {
                            if (y !== 2 && y !== 3) {
                                return false;
                            }
                        } else {
                            if (y - oldY !== 1) {
                                return false;
                            }
                        }
                        if (newTile != null) {
                            if (x !== oldX + 1 && x !== oldX - 1 || y - oldY !== 1) {
                                return false;
                            }
                        } else {
                            if (x !== oldX)
                                return false;
                        }

                        if (y === 7) {
                            piece = 'bQ';
                        }
                        break;
                    case 'R':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (travelThroughPiece()) {
                            return false;
                        }
                        if (x !== oldX && y !== oldY) {
                            return false;
                        }
                        if (x === 0 && blackRook1NotMoved) {
                            blackRook1NotMoved = false;
                        } else if (x === 7 && blackRook2NotMoved) {
                            blackRook2NotMoved = false;
                        }
                        break;
                    case 'N':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (y + 2 === oldY || y - 2 === oldY) {
                            if (x + 1 !== oldX && x - 1 !== oldX) {
                                return false;
                            }
                        } else if (y + 1 === oldY || y - 1 === oldY) {
                            if (x + 2 !== oldX && x - 2 !== oldX) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    case 'K':
                        if (x + 2 === oldX) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            if (blackRook1NotMoved) {
                                if (blackKingNotMoved) {
                                    board[0][0] = null;
                                    board[y][x + 1] = 'bR';
                                    blackKingNotMoved = false;
                                    blackRook1NotMoved = false;
                                    break;
                                }
                            }
                        } else if (x - 2 === oldX) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            if (blackRook2NotMoved) {
                                if (blackKingNotMoved) {
                                    board[0][7] = null;
                                    board[y][x - 1] = 'bR';
                                    blackKingNotMoved = false;
                                    blackRook2NotMoved = false;
                                    break;
                                }
                            }
                        }
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (y + 1 !== oldY && y - 1 !== oldY && y !== oldY) {
                            return false;
                        }
                        if (x + 1 !== oldX && x - 1 !== oldX && x !== oldX) {
                            return false;
                        }
                        if (blackKingNotMoved) {
                            blackKingNotMoved = false;
                        }
                        if (board[y][x + 1] === 'wK' || board[y][x - 1] === 'wK') {
                            return false;
                        } else if (board[y + 1][x] === 'wK' || board[y - 1][x] === 'wK') {
                            return false;
                        } else if (board[y + 1][x + 1] === 'wK' || board[y + 1][x - 1] === 'wK') {
                            return false;
                        } else if (board[y - 1][x + 1] === 'wK' || board[y - 1][x - 1] === 'wK') {
                            return false;
                        }
                        break;
                    case 'B':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (Math.abs(x - oldX) !== Math.abs(y - oldY)) {
                            return false;
                        }
                        if (y < oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX + i] !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                    case 'Q':
                        if (x === oldX && y === oldY) {
                            return false;
                        }
                        if (x === oldX && y !== oldY) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            break;
                        }
                        if (x !== oldX && y === oldY) {
                            if (travelThroughPiece()) {
                                return false;
                            }
                            break;
                        }
                        if (Math.abs(x - oldX) !== Math.abs(y - oldY)) {
                            return false;
                        }
                        if (y < oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (board[oldY + i][oldX + i] !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                        break;
                }
            }
            flagForMove = !flagForMove
            return true
        } else {
            return false
        }

    }

    // converting an array with chess pieces to a FEN string

    const boardToFEN = () => {
        let fen = '';

        for (let y = 0; y < 8; y++) {
            let nullCounter = 0;
            for (let x = 0; x < 8; x++) {
                if (board[y][x] === null) {
                    nullCounter++;
                } else {
                    if (nullCounter !== 0) {
                        fen += nullCounter + board[y][x];
                        nullCounter = 0;
                    } else if (nullCounter === 0) {
                        fen += board[y][x];
                    }

                }
            }
            if (y !== 7) {
                if (nullCounter !== 0)
                    fen += nullCounter + '/';
                else if (nullCounter === 0)
                    fen += '/';
            }
        }

        return fen
    }

    // converting a FEN string to an array with chess pieces

    const FENtoBoard = (fen) => {
        let split = fen.split('/');

        for (let y = 0; y < 8; y++) {
            let z = 0;
            for (let x = 0; x < 8; x++) {
                if (/\d/.test(split[y].charAt(z))) {
                    let j = x + parseInt(split[y].charAt(z))
                    for (; x < j; x++) {
                        board[y][x] = null;
                    }
                    z++;
                }
                if (/[a-zA-Z]/.test(split[y].charAt(z))) {
                    board[y][x] = split[y].charAt(z) + split[y].charAt(z + 1);
                    z += 2;
                }
            }
        }
    }

    // copying the array with chess pieces and turning them into div classes

    const renderPieces = () => {
        let newArray = [];

        for (let i = 0; i < board.length; i++)
            newArray[i] = board[i].slice();

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let color = 'black';
                if ((x + y) % 2 === 0) {
                    color = 'white'
                }
                if (board[y][x] != null) {
                    newArray[y][x] = (
                        <div onClick={() => redirect(y, x)} id={y + '' + x} className={color + ' tile'}>
                            <img src={'../../static/images/chessPieces/' + board[y][x] + '.svg'}
                                 alt='chess piece'/>
                        </div>
                    );
                } else {
                    newArray[y][x] =
                        <div onClick={() => redirect(y, x)} id={y + '' + x} className={color + ' tile'}/>
                }
            }
        }
        setJSXBoard(newArray);
    }

    const fetchBoard = async () => {
        let response = await fetch('/api/chessboard?code=' + code[2]);
        if (!response.ok) {
            window.location.href = '';
        }
        return await response.json();
    }

    // during each re-render/ jsx board change we call the conversion function

    useEffect(() => {
            if (!didLoad) {
                code = window.location.pathname.split('/');
                fetchBoard().then(data => {
                    FENtoBoard(data['board']);
                    flagForMove = data['personToMove'] === 'white';
                });
                didLoad = true;
            }
            renderPieces();
        }
    );

    return (
        <div id='chessboard'>
            {jsxBoard}
        </div>
    );
};