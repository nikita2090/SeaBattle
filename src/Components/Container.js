import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Container = ({children}) => (
    <div className="container">
        {children}
    </div>
);

export default Container;