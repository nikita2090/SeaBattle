import React, {Component} from 'react';
import Board from '../Board/index';

const PlayerBd = addPlayerFunctional(Board);

export default PlayerBd;

function addPlayerFunctional(WrappedBoard) {
    class PlayerBoard extends Component{
        handleClick = (i) => {
            this.props.build(i);
        };

        render(){
            return (
                <WrappedBoard
                    squares={this.props.squares}
                    onClick={(i) => this.handleClick(i)}
                    {...this.props}/>
            )
        }
    }

    return PlayerBoard;
}

