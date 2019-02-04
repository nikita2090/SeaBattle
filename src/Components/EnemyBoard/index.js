import React, {Component} from 'react';
import Board from '../Board/index';
import PropTypes from 'prop-types';

const EnemyBd = addEnemyFunctional(Board);

export default EnemyBd;

function addEnemyFunctional(WrappedBoard) {
    class EnemyBoard extends Component{
        componentDidMount() {
            this.props.build();
        }

        componentDidUpdate() {
            this.props.turn();
        }

        handleClick = (i) => {
            this.props.onClick(i);
        };

        render(){
            return (
                <WrappedBoard
                    squares={this.props.squares}
                    onClick={this.handleClick}
                    enemy={true}
                    {...this.props}
                />
            )
        }
    }

    EnemyBoard.propTypes = {
        squares: PropTypes.array.isRequired,
        build: PropTypes.func,
        turn: PropTypes.func,
        handleEnemyBoardClick: PropTypes.func,
    };

    return EnemyBoard;
}



