import React from 'react';
import {Col, Container, FormControl, FormLabel, FormText, Row} from "react-bootstrap";

export default function JoinGame() {
    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={'auto'}>
                        <FormLabel size={'lg'}>Join A Game</FormLabel>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={'auto'}>
                        <FormControl size={'lg'} type={'text'} placeholder={'Input your game code'}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}