import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Row = ({children}) => (
    <div className="row justify-content-center">
        {children}
    </div>
);

export default Row;