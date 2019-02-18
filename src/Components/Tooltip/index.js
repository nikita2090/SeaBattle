import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css'

export default class Tooltip extends Component {
    render() {
        let {winner, playerFreePoints} = this.props;

        //if winner is known, display him
        if (winner) {
            return (
                <div className="tooltip ">
                    <div>
                        {winner === 'Enemy' ? 'Sorry but...' : 'Congratulations!'}
                    </div>
                    <div>
                        {winner} wins!
                    </div>
                </div>)
        }

        let currentShipName;
        for (let shipName in playerFreePoints) {
            if (playerFreePoints.hasOwnProperty(shipName)) {
                if (playerFreePoints[shipName].length !== 0) {
                    currentShipName = shipName;
                }

                //if player built all ships display this
                if (!currentShipName) {
                    return (
                        <div className="tooltip green">
                            <div>Now you can play!</div>
                            <div>Your turn!</div>
                        </div>)
                }
            }
        }

        //display tooltip with type of ship, its squares and amount of available ships
        let availableShipsAmount = playerFreePoints[currentShipName].length;
        let shipNames = Object.keys(playerFreePoints);
        let shipNumber = shipNames.indexOf(currentShipName);
        let shipSizes = [1, 2, 3, 4];
        let currentShipSize = shipSizes[shipNumber];

        return (
            <div className="tooltip orange">
                <div>
                    Click on {currentShipSize} {currentShipSize > 1 ? 'adjacent' : ''} square{currentShipSize > 1 ? 's' : ''} to build {currentShipName}.
                </div>

                <div>
                    Now you can build {availableShipsAmount > 0 ? availableShipsAmount : ''} ship{availableShipsAmount > 1 ? 's' : ''} of this type.
                </div>
            </div>
        );
    }
}


Tooltip.propTypes = {
    winner: PropTypes.oneOf(['', 'Enemy', 'Player']).isRequired,
    playerFreePoints: PropTypes.shape({
        vedette: PropTypes.array,
        destroyer: PropTypes.array,
        cruiser: PropTypes.array,
        battleship: PropTypes.array
    }).isRequired
};