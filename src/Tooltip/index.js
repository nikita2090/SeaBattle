import React from 'react';

export default function Tooltip(props) {
    let shipPoints = props.value;
    let shipNames = Object.keys(props.value);
    let current = shipNames.length - 1;
    let currentShip = shipNames[current];
    let shipSizes = [1, 2, 3, 4];
    let availableShipsAmount = shipPoints[currentShip].length;
    let allShipsBuilt = false;

    for (let points in shipPoints) {
        if (availableShipsAmount === 0) {
            current--;
            if (current < 0) {
                allShipsBuilt = true;
                break;
            }
            else {
                currentShip = shipNames[current];
                availableShipsAmount = shipPoints[currentShip].length;
            }
        }
    }


    if (allShipsBuilt) {
        return(
            <div>
                <div>Now you can play!</div>
                <div>Your turn!</div>
            </div>)
    } else {
        return (
            <div>
                <div>
                    Click on {shipSizes[current]} {shipSizes[current] >1 ? 'adjacent' : ''} square{shipSizes[current] > 1 ? 's' : ''} to
                    build {currentShip}.
                </div>

                <div>
                    Now you can build {availableShipsAmount > 0 ? availableShipsAmount : ''} ship{availableShipsAmount > 1 ? 's' : ''} of this type.
                </div>
            </div>
        )
    }
}