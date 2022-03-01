import React, {useEffect, useState} from "react";

let board = Array.from(Array(8), () => new Array(8));

let flag = true;
let flagForMove = false;
let piece = '';
let blackOrWhite = ''
let didLoad = false;
let oldX = ''
let oldY = ''


function Chessboard() {


    const [jsxBoard, setJSXBoard] = useState(
        Array.from(Array(8), () => new Array(8))
    );


    // moving pieces from one note to another
    // moving them through the board array and placing them into the jsx board

    const redirect = (y, x) => {
        if (flagForMove) {
            blackOrWhite = 'black'
        } else {
            blackOrWhite = 'white'
        }

        if (flag) {
            if (board[y][x] != null) {
                piece = board[y][x];
                board[y][x] = null;
                oldX = x;
                oldY = y;
                flag = false;
            }
        } else {
            if (rulesOfChess(y, x, board[y][x])) {
                board[y][x] = piece;
                const sendPOST = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        personToMove: blackOrWhite,
                        board: boardToFEN(),
                    }),
                };
                fetch('/api/create', sendPOST)
                    .then((response) => response.json())
                    .then((data) => console.log(data))
            } else
                board[oldY][oldX] = piece;

            flag = true;

        }

        setJSXBoard(board);

    }

    const rulesOfChess = (y, x, newTile) => {
        const travelThroughPiece = () => {
            if (y !== oldY && x === oldX) {
                if (y > oldY) {
                    for (let i = y; i > oldY; i--) {
                        if (board[i][x] !== null) {
                            return true;
                        }
                    }
                } else if (y < oldY) {
                    for (let i = y; i < oldY; i++) {
                        if (board[i][x] !== null) {
                            return true;
                        }
                    }
                }
            } else if (x !== oldX && y === oldY) {
                if (x > oldX) {
                    for (let i = x; i > oldX; i--) {
                        if (board[y][i] !== null) {
                            return true;
                        }
                    }
                } else if (x < oldX) {
                    for (let i = x; i < oldX; i++) {
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
                    if (newTile.charAt(0) === 'w') {
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


                }
            } else if (piece.charAt(0) === 'b') {
                if (newTile != null) {
                    if (newTile.charAt(0) === 'b') {
                        return false;
                    }
                }

                switch (piece.charAt(1)) {
                    case 'P':
                        if (travelThroughPiece()) {
                            console.log('asd')
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
        let response = await fetch('/api/chessboard');
        return await response.json();
    }

    // during each re-render/ jsx board change we call the conversion function

    useEffect(() => {
            if (!didLoad) {
                fetchBoard().then(data => {
                    FENtoBoard(data[0]['board']);
                    flagForMove = data[0]['personToMove'] === 'white';
                })
                didLoad = true;
            }
            // console.log('asd')
            renderPieces();
        }
    );

    return (
        <div id='chessboard'>
            {jsxBoard}
        </div>
    );
}

export default Chessboard