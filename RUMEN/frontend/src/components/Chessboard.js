import React, {useEffect, useState} from "react";

let board = Array.from(Array(8), () => new Array(8));

let flag = true;
let flagForMove = false;
let piece = '';
let blackOrWhite = ''
let didLoad = false;


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
                flag = false;
            }
        } else {
            board[y][x] = piece;
            flag = true;

            flagForMove = !flagForMove

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
        }

        setJSXBoard(board);

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
        console.log(board);
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

    // during each re-render/ jsx board change we call the conversion function

    useEffect(() => {
            if (!didLoad) {
                fetch('/api/chessboard').then((response) => response.json()).then((data) => {
                    FENtoBoard(data[0]['board']);
                    flagForMove = data[0]['personToMove'] === 'white';
                })
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
}

export default Chessboard