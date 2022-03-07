import React, {Component} from "react";
import Chessboard from "./components/Chessboard";


class App extends Component {
    constructor(props) {
        super(props);
    }

    restartGame = () => {
        const sendPOST = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                personToMove: 'black',
                board: 'bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP/wRwNwBwQwKwBwNwR',
            }),
        };
        fetch('/api/create', sendPOST);
    }

    render() {
        return (
            <>
                <Chessboard/>
                {/*<button id="restartGameButton" onClick={this.restartGame}>Restart</button>*/}
            </>
        )
    }
}


export default App