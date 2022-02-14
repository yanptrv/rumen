import React, {Component} from "react";


class Chessboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [
                ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
                ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
                ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
            ],
        };
    }

    renderPieces = () => {
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                let color = 'black';
                if ((x + y) % 2 === 0) {
                    color = 'white'
                }
                if (this.state.board[y][x] != null) {
                    this.state.board[y][x] = (
                        <div className={color}>
                            <img src={'../../static/images/chessPieces/' + this.state.board[y][x] + '.svg'} alt='chess piece'/>
                        </div>
                    );
                } else {
                    this.state.board[y][x] = <div className={color}/>
                }
            }
        }
    }

    render() {
        this.renderPieces()
        return (
            <div id='chessboard'>
                {this.state.board}
            </div>
        );
    }
}

export default Chessboard