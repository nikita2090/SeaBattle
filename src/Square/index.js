import React, {Component} from 'react';
import './styles.css';

export default class Square extends Component {
    render() {
        return (
            <td
                className={this.props.value ? 'square boat' : 'square'}
                onClick={this.props.onClick}>
                    {this.props.number}
            </td>
        )
    }
}