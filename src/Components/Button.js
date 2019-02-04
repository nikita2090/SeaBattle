import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const Button = ({children, onClick}) => (
    <button onClick={onClick} className="button col-xl-6 col-sm-8 col-xxs-10">
        {children}
    </button>
);

export default Button;