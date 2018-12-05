import React, {Component} from 'react';
import Board from '../Board';

const EnemyBd = addEnemyFunctional(Board);

export default EnemyBd;

function addEnemyFunctional(WrappedBoard) {
    class EnemyBoard extends Component{
        componentDidMount() {
            this.props.build();
        }

        handleClick = (i) => {

        };

        render(){
            return (
                <WrappedBoard
                    squares={this.props.squares}
                    onClick={(i) => this.handleClick(i)}
                    {...this.props}
                />
            )
        }
    }

    return EnemyBoard;
}



