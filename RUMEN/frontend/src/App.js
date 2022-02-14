import React, {Component} from "react";
import Chessboard from "./components/Chessboard";

const boardInfo = '1hK'

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <Chessboard />
        )
    }
}

export default App