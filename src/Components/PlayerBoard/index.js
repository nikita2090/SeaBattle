import React, {Component} from 'react';
import Board from '../Board/index';
import PropTypes from 'prop-types';

const PlayerBd = addPlayerFunctional(Board);

export default PlayerBd;

function addPlayerFunctional(WrappedBoard) {
    class PlayerBoard extends Component {
        handleClick = (i) => {
            this.props.build(i);
        };

        render() {
            return (
                <WrappedBoard
                    squares={this.props.squares}
                    onClick={(i) => this.handleClick(i)}
                    enemy={false}
                    {...this.props}/>
            )
        }
    }

    PlayerBoard.propTypes = {
        squares: PropTypes.array.isRequired,
        build: PropTypes.func
    };

    return PlayerBoard;
}




