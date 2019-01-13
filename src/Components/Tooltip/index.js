import React from 'react';
import './styles.css'

export default function Tooltip(props) {
    let winner = props.winner;
    if (winner) {
        return (
            <div className="tooltip ">
                <div>
                    {winner === 'Enemy'?'Sorry but...': 'Congratulations!'}
                </div>
                <div >
                    {winner} wins!
                </div>
            </div>)
    }

    let shipPoints = props.value;
    let currentShipName;
    for (let shipName in shipPoints) {
        if (shipPoints.hasOwnProperty(shipName)) {
            if (shipPoints[shipName].length !== 0) {
                currentShipName = shipName;
            }

            if (!currentShipName) {
                return (
                    <div className="tooltip green">
                        <div>Now you can play!</div>
                        <div>Your turn!</div>
                    </div>)
            }
        }
    }

    let availableShipsAmount = shipPoints[currentShipName].length;
    let shipNames = Object.keys(props.value);
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