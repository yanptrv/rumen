import React, {useEffect, useState} from "react";
import {AiOutlineRollback} from "react-icons/ai";
import {CopyToClipboard} from "react-copy-to-clipboard/src";
import {Button, Col, Container, Row} from "react-bootstrap";
import Footer from "./Footer";
import {ToastContainer, toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {Howl, Howler} from 'howler';

let flagForMove = false;
let code = '';
let secondPlayer = '';
let flag = true;
let piece = '';
let blackOrWhite = '';
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
let myColor = '';

export default function Chessboard() {

    const {Howl, Howler} = require('howler');
    let navigate = useNavigate();
    let sound = new Howl({
        src: ['https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3']
    });

    const requestSocket = new WebSocket(`ws://${window.location.host}/ws/socket-server/`)
    requestSocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.message === 'update' && data.type === 'chat' && data.code === code) {
            setDidLoad(false);
        }
    }

    const [board, setBoard] = useState(
        Array.from(Array(8), () => new Array(8))
    );
    const [didLoad, setDidLoad] = useState(false);


    // const legalMoves = (chessBoard) => {
    //
    //     let kingX;
    //     let kingY;
    //
    //     if (blackOrWhite === 'white') {
    //         for (let y = 0; y < 8; y++) {
    //             for (let x = 0; x < 8; x++) {
    //                 if (chessBoard[y][x] === 'wK') {
    //                     kingY = y;
    //                     kingX = x;
    //                 }
    //             }
    //         }
    //     } else if (blackOrWhite === 'black') {
    //         for (let y = 0; y < 8; y++) {
    //             for (let x = 0; x < 8; x++) {
    //                 if (chessBoard[y][x] === 'bK') {
    //                     kingY = y;
    //                     kingX = x;
    //                 }
    //             }
    //         }
    //
    //         for (let y = 0; y < 8; y++) {
    //             for (let x = 0; x < 8; x++) {
    //                 let chessPiece = chessBoard[y][x].charAt(0)
    //                 if (chessPiece.charAt(0) === 'w') {
    //                     if (chessPiece.charAt(1) === 'P') {
    //                         if (chessBoard[y+1][x+1] === 'bK' || chessBoard[y+1][x-1] === 'bK') {
    //                             blackKingMustMove = true;
    //                             return;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    // }

    // moving pieces from one tile to another and validating the move

    const redirect = (y, x) => {
        let chessBoard = [];
        for (let i = 0; i < board.length; i++) {
            chessBoard[i] = board[i].slice();
        }

        //checking for white or black to move

        if (flagForMove) {
            blackOrWhite = 'black'
        } else {
            blackOrWhite = 'white'

        }

        if (flag) {

            //removing the piece and saving its coordinates
            if (chessBoard[y][x] != null) {
                piece = chessBoard[y][x];
                if (piece.charAt(0) === 'w' && secondPlayer===true) {
                    return false;
                } else if (piece.charAt(0) === 'b' && secondPlayer!==true) {
                    return false;
                }
                chessBoard[y][x] = null;
                oldX = x;
                oldY = y;
                flag = false;
            }
        } else {

            sound.play();
            //checking if the move is legal, if not returning it to its original place

            if (rulesOfChess(y, x, chessBoard)) {
                chessBoard[y][x] = piece;
                const sendPOST = {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        personToMove: blackOrWhite,
                        board: boardToFEN(chessBoard),
                        code: code,
                    }),
                };
                fetch('/api/update', sendPOST).then(() => {
                    requestSocket.send(JSON.stringify({
                        'message': 'update',
                        'code': code,
                    }))
                });
            } else {
                chessBoard[oldY][oldX] = piece;
            }

            flag = true;
        }

        setBoard(chessBoard);

    }

    // validating moves

    const rulesOfChess = (y, x, chessBoard) => {

        let newTile = chessBoard[y][x];

        //checking if there are pieces when moving horizontally or vertically

        const travelThroughPiece = () => {
            if (y !== oldY && x === oldX) {
                if (y > oldY) {
                    for (let i = y - 1; i > oldY; i--) {
                        if (chessBoard[i][x] !== null) {
                            return true;
                        }
                    }
                } else if (y < oldY) {
                    for (let i = y + 1; i < oldY; i++) {
                        if (chessBoard[i][x] !== null) {
                            return true;
                        }
                    }
                }
            } else if (x !== oldX && y === oldY) {
                if (x > oldX) {
                    for (let i = x - 1; i > oldX; i--) {
                        if (chessBoard[y][i] !== null) {
                            return true;
                        }
                    }
                } else if (x < oldX) {
                    for (let i = x + 1; i < oldX; i++) {
                        if (chessBoard[y][i] !== null) {
                            return true;
                        }
                    }
                }
            }
            return false
        }

        if (piece.charAt(0) === blackOrWhite.charAt(0)) {
            if (piece.charAt(0) === 'w') {
                if (secondPlayer) {
                    return false;
                }
                if (newTile != null) {
                    if (newTile.charAt(0) === 'w') {
                        return false;
                    }
                    if (newTile.charAt(1) === 'K') {
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
                                    chessBoard[7][0] = null;
                                    chessBoard[y][x + 1] = 'wR';
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
                                    chessBoard[7][7] = null;
                                    chessBoard[y][x - 1] = 'wR';
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
                        if (chessBoard[y][x + 1] === 'bK' || chessBoard[y][x - 1] === 'bK') {
                            return false;
                        } else if (chessBoard[y + 1][x] === 'bK' || chessBoard[y - 1][x] === 'bK') {
                            return false;
                        } else if (chessBoard[y + 1][x + 1] === 'bK' || chessBoard[y + 1][x - 1] === 'bK') {
                            return false;
                        } else if (chessBoard[y - 1][x + 1] === 'bK' || chessBoard[y - 1][x - 1] === 'bK') {
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
                                    if (chessBoard[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX + i] !== null) {
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
                                    if (chessBoard[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX + i] !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                        break;

                }
            } else if (piece.charAt(0) === 'b') {
                if (!secondPlayer) {
                    return false;
                }
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
                                    chessBoard[0][0] = null;
                                    chessBoard[y][x + 1] = 'bR';
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
                                    chessBoard[0][7] = null;
                                    chessBoard[y][x - 1] = 'bR';
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
                        if (chessBoard[y][x + 1] === 'wK' || chessBoard[y][x - 1] === 'wK') {
                            return false;
                        } else if (chessBoard[y + 1][x] === 'wK' || chessBoard[y - 1][x] === 'wK') {
                            return false;
                        } else if (chessBoard[y + 1][x + 1] === 'wK' || chessBoard[y + 1][x - 1] === 'wK') {
                            return false;
                        } else if (chessBoard[y - 1][x + 1] === 'wK' || chessBoard[y - 1][x - 1] === 'wK') {
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
                                    if (chessBoard[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX + i] !== null) {
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
                                    if (chessBoard[oldY - i][(oldX - i)] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY - i][(oldX + i)] !== null) {
                                        return false;
                                    }
                                }
                            }
                        } else if (y > oldY) {
                            if (x < oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX - i] !== null) {
                                        return false;
                                    }
                                }
                            } else if (x > oldX) {
                                for (let i = 1; i < Math.abs(y - oldY); i++) {
                                    if (chessBoard[oldY + i][oldX + i] !== null) {
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

    const boardToFEN = (chessBoard) => {

        let fen = '';

        for (let y = 0; y < 8; y++) {
            let nullCounter = 0;
            for (let x = 0; x < 8; x++) {
                if (chessBoard[y][x] === null) {
                    nullCounter++;
                } else {
                    if (nullCounter !== 0) {
                        fen += nullCounter + chessBoard[y][x];
                        nullCounter = 0;
                    } else if (nullCounter === 0) {
                        fen += chessBoard[y][x];
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

        let chessBoard = Array.from(Array(8), () => new Array(8));
        let boardRows = fen.split('/');

        for (let y = 0; y < 8; y++) {
            let rowIndex = 0;
            for (let x = 0; x < 8; x++) {
                if (/\d/.test(boardRows[y].charAt(rowIndex))) {
                    let nullAmount = x + parseInt(boardRows[y].charAt(rowIndex))
                    for (; x < nullAmount; x++) {
                        chessBoard[y][x] = null;
                    }
                    rowIndex++;
                }
                if (/[a-zA-Z]/.test(boardRows[y].charAt(rowIndex))) {
                    chessBoard[y][x] = boardRows[y].charAt(rowIndex) + boardRows[y].charAt(rowIndex + 1);
                    rowIndex += 2;
                }
            }
        }
        setBoard(chessBoard);

    }

    // redirecting to the home page

    const goHome = () => navigate('/');

    // notification when copying the game code

    const notify = () => toast.dark("Copied to clipboard!", {type: toast.TYPE.SUCCESS,});

    // restarting the game to the starting layout

    const restartGame = () => {
        if (!secondPlayer) {
            const sendPOST = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    personToMove: 'black',
                    board: 'bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP/wRwNwBwQwKwBwNwR',
                    code: code,
                }),
            };
            fetch('/api/update', sendPOST).then(() => {
                requestSocket.send(JSON.stringify({
                    'message': 'update',
                    'code': code,
                }))
            })
        }

    }

    // when receiving information from the socket or first time loading fetching data from the api

    useEffect(() => {

        if (!didLoad) {
            code = window.location.pathname.split('/')[2];
            fetch('/api/chessboard?code=' + code).then((response) => response.json()).then(data => {
                flagForMove = data['personToMove'] === 'white';
                secondPlayer = data['secondPlayer'];
                if (flagForMove) {
                    blackOrWhite = 'black'
                } else {
                    blackOrWhite = 'white'
                }
                if (secondPlayer) {
                    myColor = 'black';
                } else {
                    myColor = 'white';
                }
                FENtoBoard(data['board']);
                setDidLoad(true);
            });
        }

    }, [didLoad]);

    return (
        <>
                <Container fluid>
                    <Row>
                        <Col>
                            <AiOutlineRollback className={'goBack text-dark'} onClick={goHome}/>
                        </Col>
                    </Row>
                    <Row className={'text-center mt-4'}>
                        <Col>
                            <CopyToClipboard text={code}>
                                <Button size={'lg'} variant={'dark'} onClick={notify}>Copy Code</Button>
                            </CopyToClipboard>
                        </Col>

                        <Col>
                            <h2 className={'text-light'}>Move something {blackOrWhite}</h2>
                        </Col>

                        <Col>
                            <Button disabled={secondPlayer === true} size={'lg'} variant={'warning'}
                                    onClick={restartGame}>Restart</Button>
                        </Col>


                    </Row>
                </Container>

                <div id='chessboard'>

                    {[...Array(8).keys()].map((y) => [...Array(8).keys()].map((x) => {
                        let color = 'black';
                        if ((x + y) % 2 === 0) {
                            color = 'white'
                        }
                        if (board[y][x] != null) {
                            return (
                                <div onClick={() => redirect(y, x)} id={y + '' + x} className={color + ' tile'}>
                                    <img src={'../../static/images/chessPieces/' + board[y][x] + '.svg'}
                                         alt='chess piece'/>
                                </div>
                            );
                        } else {
                            return (
                                <div onClick={() => redirect(y, x)} id={y + '' + x} className={color + ' tile'}/>
                            );
                        }
                    }))}
                </div>
            <Footer/>
            <ToastContainer/>

        </>
    );
};