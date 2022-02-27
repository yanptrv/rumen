import React, {useEffect, useState} from "react";

const board = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

let flag = true;
let piece = '';


function Chessboard() {


    const [jsxBoard, setJSXBoard] = useState(
        [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ]
    );


    const redirect = (y, x) => {
        if (flag) {
            if (board[y][x] != null) {
                piece = board[y][x];
                board[y][x] = null;
                flag = false;
            }
        } else {
            board[y][x] = piece;
            flag = true;
        }

        // let newArray = [];
        //
        // for (let i = 0; i < board.length; i++)
        //     newArray[i] = board[i].slice();

        setJSXBoard(board);
    }

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

    useEffect(() => {
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