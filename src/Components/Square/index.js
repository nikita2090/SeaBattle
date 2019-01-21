import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Square extends Component {
    render() {
        function calculateClass(value, enemy) {
            switch (value) {
                case 'empty':
                    return 'square';
                case 'boat':
                    if (enemy) return 'square';
                    return 'square boat';
                case 'killed':
                    return 'square killed';
                case 'miss':
                    return 'square miss';
                default:
            }
        }

        return (
            <td
                className={calculateClass(this.props.value, this.props.enemy)}
                onClick={this.props.onClick}>
            </td>
        )
    }
}

Square.propTypes = {
    value: PropTypes.string.isRequired,
    enemy: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};