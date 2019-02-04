import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Square extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.value !== this.props.value
    }

    static calculateClass(value, enemy) {
        switch (value) {
            case 'empty':
                return '';
            case 'boat':
                if (enemy) return '';
                return 'boat';
            case 'killed':
                return 'killed';
            case 'miss':
                return 'miss';
            default:
        }
    }

    render() {
        let {value, enemy, onClick} = this.props;
        return (
            <td
                className={`square ${Square.calculateClass(value, enemy)}`}
                onClick={onClick}>
            </td>
        )
    }
}

Square.propTypes = {
    value: PropTypes.string.isRequired,
    enemy: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};