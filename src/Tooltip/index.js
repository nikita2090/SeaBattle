import React from 'react';

export default function Tooltip(props) {
    let winner = props.winner;
    if (winner) {
        return (
            <div>
                {winner} wins!
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
                    <div>
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
        <div>
            <div>
                Click on {currentShipSize} {currentShipSize > 1 ? 'adjacent' : ''} square{currentShipSize > 1 ? 's' : ''} to build {currentShipName}.
            </div>

            <div>
                Now you can build {availableShipsAmount > 0 ? availableShipsAmount : ''} ship{availableShipsAmount > 1 ? 's' : ''} of this type.
            </div>
        </div>
    );
}