import React, {Component} from 'react';
import Board from '../Board/index';

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
            this.props.forEnemyBoardClick(i);
        };

        render(){
            return (
                <WrappedBoard
                    squares={this.props.squares}
                    onClick={(i) => this.handleClick(i)}
                    {...this.props}
                    enemy={true}
                />
            )
        }
    }

    return EnemyBoard;
}



