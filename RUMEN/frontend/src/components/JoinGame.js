import React from 'react';
import {Button, Col, Container, FormControl, FormLabel, FormText, Row} from "react-bootstrap";
import {AiOutlineRollback} from "react-icons/ai";

export default function JoinGame() {
    const goHome = () => {
        window.location.href = '/home'
    }

    return (
        <>
            <AiOutlineRollback className={'goBack'} onClick={goHome}/>
            <Container>
                <Row className="welcomeText justify-content-center text-center">
                    <Col>
                        <h1>Join a Game</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center text-center">
                    <Col className={'col-sm-5'}>
                        <FormControl size={'lg'} type={'text'} placeholder={'Input your game code'}/>
                    </Col>
                </Row>
                <Row className={'submitButton justify-content-center text-center'}>
                    <Col>
                        <Button size={'lg'} variant={'dark'}>Submit</Button>
                    </Col>
                     </Row>
            </Container>
        </>
    );
}