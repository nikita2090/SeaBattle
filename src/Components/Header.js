import React from 'react';
import Container from './Container';
import Row from './Row';

import 'bootstrap/dist/css/bootstrap.css';

const Header = ({heading}) => (
    <header>
        <Container>
            <Row>
                <h1 className="header col-xl-12">
                    {heading}
                </h1>
            </Row>
        </Container>
    </header>

);

export default Header;