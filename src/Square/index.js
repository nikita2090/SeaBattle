import React, {Component} from 'react';
import './styles.css';

export default class Square extends Component {
    render() {
        function calculateClass(value) {
            switch(value){
                case 'empty':
                    return 'square';
                case 'boat':
                    return 'square boat';
                case 'killed':
                    return 'square killed';
                case 'miss':
                    return 'square miss'
            }
        }
        return (
            <td
                className={calculateClass(this.props.value)}
                onClick={this.props.onClick}>
                    {this.props.number}
            </td>
        )
    }
}