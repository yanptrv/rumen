import React, {useState} from 'react';
import {Button, Col, Container, FloatingLabel, Form, FormControl, Row} from "react-bootstrap";
import {AiOutlineRollback} from "react-icons/ai";
import Footer from "./Footer";
import {useNavigate} from 'react-router-dom';

export default function JoinGame() {
    let navigate = useNavigate();
    const goHome = () => {
        navigate('/');
    }

    const joinGame = () => {
        if (code !== '') {
            navigate('/join/' + code);
        }
    }

    const [code, setCode] = useState('');

    return (
        <>
            <AiOutlineRollback className={'goBack text-dark'} onClick={goHome}/>
            <Container>
                <Row className="welcomeText justify-content-center text-center">
                    <Col>
                        <h1 className={'text-warning'}>Join a Game</h1>
                    </Col>
                </Row>
                <Form onSubmit={joinGame} >
                <Row className="justify-content-center text-center mt-5">
                    <Col className={'col-sm-5'}>
                            <FloatingLabel label={'Input your game code'}>
                                <FormControl onChange={(e) => {
                                    setCode(e.target.value)
                                }} placeholder={''} size={'lg'} type={'text'}/>
                            </FloatingLabel>
                    </Col>
                </Row>
                <Row className={'mt-3 justify-content-center text-center'}>
                    <Col>
                        <Button size={'lg'} variant={'dark'} type={'submit'}>Submit</Button>
                    </Col>
                </Row>
                </Form>
            </Container>
            <Footer/>
        </>
    );
}