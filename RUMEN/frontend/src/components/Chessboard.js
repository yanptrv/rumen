import React, {Component} from "react";

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

class Chessboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsxBoard: [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
            ],
            msg: '',
        };
    }


    redirect = (y, x) => () => {
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

        let newArray = [];

        for (let i = 0; i < board.length; i++)
            newArray[i] = board[i].slice();

        this.setState({jsxBoard: newArray});
    }

    renderPieces() {
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let color = 'black';
                if ((x + y) % 2 === 0) {
                    color = 'white'
                }
                if (board[y][x] != null) {
                    this.state.jsxBoard[y][x] = (
                        <div onClick={this.redirect(y, x)} id={y + '' + x} className={color + ' tile'}>
                            <img src={'../../static/images/chessPieces/' + board[y][x] + '.svg'}
                                 alt='chess piece'/>
                        </div>
                    );
                } else {
                    this.state.jsxBoard[y][x] =
                        <div onClick={this.redirect(y, x)} id={y + '' + x} className={color + ' tile'}/>
                }
            }
        }
    }

    render() {
        this.renderPieces()
        console.log(this.state.jsxBoard);
        return (
            <div id='chessboard'>
                {this.state.jsxBoard}
            </div>
        );
    }
}

export default Chessboard