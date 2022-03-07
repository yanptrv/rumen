import React from 'react'
import {Button, ButtonGroup, Col, Container, Row} from 'react-bootstrap';


export default function Home() {
    const createGame = () => {
        const sendPOST = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                personToMove: 'black',
                board: 'bRbNbBbQbKbBbNbR/bPbPbPbPbPbPbPbP/8/8/8/8/wPwPwPwPwPwPwPwP/wRwNwBwQwKwBwNwR',
            }),
        };
        fetch('/api/create', sendPOST)
            .then((response) => response.json())
            .then((data) => window.location.href = '/join/' + data['code']);
    }

    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={'auto'}>
                        <h1>WELCOME TO RUMEN</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={'auto'}>
                        <ButtonGroup>
                            <Button href={'/join'} variant={'dark'} size={'lg'}>Join Game</Button>
                            <Button variant={'outline-warning'} size={'lg'} onClick={createGame}>Create New
                                Game</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}