import React from 'react'
import {Button, ButtonGroup, Col, Container, Row} from 'react-bootstrap';
import {AiFillGithub, AiFillLinkedin, AiFillTwitterCircle} from "react-icons/ai";


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
            <Container className={'welcomeText'}>
                <Row className="justify-content-center text-center">
                    <Col>
                        <h1>WELCOME TO RUMEN</h1>
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
            <Container className="fixed-bottom">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top border-dark">
                    <div className="col-md-4 d-flex align-items-center">
                        <span className="text-dark">2022 Petrov, Kristiyan</span>
                    </div>
                    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="ms-3"><a className="text-dark" href="https://www.linkedin.com/in/kris-petrov/" target={'_blank'}>
                            <AiFillLinkedin fontSize={'24'}/>
                        </a></li>
                        <li className="ms-3"><a className="text-dark" href="https://github.com/krispetrov/" target={'_blank'}>
                            <AiFillGithub fontSize={'24'}/>
                        </a></li>
                        <li className="ms-3"><a className="text-dark" href="https://twitter.com/yanpetrow/" target={'_blank'}>
                            <AiFillTwitterCircle fontSize={'24'}/>
                        </a></li>
                    </ul>
                </footer>
            </Container>
        </>
    );
}