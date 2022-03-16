import React from 'react'
import {Button, ButtonGroup, Col, Container, Row} from 'react-bootstrap';
import TextAnimation from "react-animate-text";
import Footer from "./Footer";


export default function Home() {
    const createGame = () => {
        const sendPOST = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            }),
        };
        fetch('/api/create', sendPOST)
            .then((response) => response.json())
            .then((data) => window.location.href = '/join/' + data['code']);
    }

    return (
        <>
            <Container className={'welcomeText'}>
                <Row className="justify-content-center text-center">
                    <Col>
                        <TextAnimation><h1 className={'text-warning'}>WELCOME TO RUMEN!</h1></TextAnimation>
                    </Col>
                </Row>
                <Row className="justify-content-center text-center mt-3">
                    <Col>
                        <ButtonGroup>
                            <Button href={'/join'} variant={'dark'} size={'lg'}>Join Game</Button>
                            <Button variant={'outline-warning'} size={'lg'} onClick={createGame}>Create New
                                Game</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </>
    );
}