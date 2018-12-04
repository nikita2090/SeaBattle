import React, {Component} from 'react';

import Board from '../Board';
import Tooltip from '../Tooltip';
import {calculateAvailableValues, calculateHalo} from '../functions';

const PlayerBd = addPlayerFunctional(Board);

export default PlayerBd;

function addPlayerFunctional(WrappedBoard) {
    class PlayerBoard extends Component{
        constructor(props){
            super(props);
            this.state = {
                squares: new Array(100).fill(false),
                freePoints: {
                    vedette: [1, 1, 1, 1],
                    destroyer: [2, 2, 2],
                    cruiser: [3, 3],
                    battleship: [4]
                }
            };
            this.builtShipNumbers = [];
            this.reservedSquares = [];
            this.availableVals = Array.from(new Array(100).keys());
            this.ships = Object.getOwnPropertyNames(this.state.freePoints);
            this.shipKey = this.ships.length - 1;
            this.currentShip = this.ships[this.shipKey];
        }

        handleClick = (i) => {
            let newSquares = this.state.squares.slice(); //make a copy of our state.squares

            if (!this.availableVals) return;
            if (this.availableVals.includes(i)) {
                let newPoints = Object.assign({}, this.state.freePoints); //make a copy of our state.freePoints
                let currentShipBuildingPointsArr = newPoints[this.currentShip];
                let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];

                newSquares[i] = true;
                this.builtShipNumbers.push(i);

                let availableVals = calculateAvailableValues(this.builtShipNumbers);
                console.log('availableVals:' + availableVals);
                this.availableVals = availableVals.filter(elem => !this.reservedSquares.includes(elem));

                this.setState({
                    squares: newSquares
                });

                points--;
                currentShipBuildingPointsArr.pop();
                if (points < 1) {
                    if (Math.max(this.state.freePoints.vedette) < 1) {
                        setTimeout(() => {
                            alert('Ships are ready!');
                        }, 0);
                        this.availableVals = null;
                        return;
                    }

                    let halo = calculateHalo(this.builtShipNumbers); //calculate halo around the builded ship
                    this.reservedSquares = this.reservedSquares.concat(this.builtShipNumbers, halo);//new set?
                    console.log(this.reservedSquares);

                    this.builtShipNumbers = [];
                    let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
                    this.availableVals = newArr.filter(elem => !this.reservedSquares.includes(elem));

                    if (currentShipBuildingPointsArr.length === 0) {
                        this.shipKey--;
                        this.currentShip = this.ships[this.shipKey];
                    }
                } else {
                    currentShipBuildingPointsArr.push(points);
                    this.setState({
                        freePoints: newPoints
                    });
                }
            }
        };

        render(){
            return (
                <>
                <Tooltip value={this.state.freePoints}/>
                <WrappedBoard
                    squares={this.state.squares}
                    onClick={(i) => this.handleClick(i)}
                    reserved={this.reservedSquares}
                    {...this.props}/>
                </>
            )
        }
    }

    return PlayerBoard;
}

