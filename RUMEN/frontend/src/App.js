import React, {Component} from "react";
import Chessboard from "./components/Chessboard";


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