import React, {Component} from 'react';

import Board from '../Board';
import {calculateAvailableValues, calculateHalo} from '../functions';

const EnemyBd = addEnemyFunctional(Board);

export default EnemyBd;

function addEnemyFunctional(WrappedBoard) {
    class EnemyBoard extends Component{
        constructor(props){
            super(props);
            this.state = {
                squares: new Array(100).fill(false),
            };

            this.squares = new Array(100).fill(false);
            this.freePoints = {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            };
            this.builtShipNumbers = [];
            this.reservedSquares = [];
            this.availableVals = Array.from(new Array(100).keys());
            this.ships = Object.getOwnPropertyNames(this.freePoints);
            this.shipKey = this.ships.length - 1;
            this.currentShip = this.ships[this.shipKey];
        }

        componentDidMount() {
            for(let i = 0; i < 20; i++){
                //console.log('length:' + this.availableVals.length);
                let rand = Math.floor(Math.random() * this.availableVals.length);
                //console.log('RANDOM:'+rand);

                let randomAvaliableValue = this.availableVals[rand];

                let newSquares = this.squares.slice(); //make a copy of our state.squares
               // console.log(newSquares);
                if (!this.availableVals) return;
                //if (this.availableVals.includes(rand)) {
                    let newPoints = Object.assign({}, this.freePoints); //make a copy of our state.freePoints
                    let currentShipBuildingPointsArr = newPoints[this.currentShip];
                    let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];

                    newSquares[randomAvaliableValue] = true;
                    //console.log(newSquares);
                    this.builtShipNumbers.push(randomAvaliableValue);
                    //console.log('this.builtShipNumbers:' + this.builtShipNumbers);

                    let availableVals = calculateAvailableValues(this.builtShipNumbers);

                    this.availableVals = availableVals.filter(elem => !this.reservedSquares.includes(elem));
                    //console.log('this.availableVals' + this.availableVals);

                    /*this.setState({
                        squares: newSquares
                    });*/
                    this.squares = newSquares;


                    points--;
                    currentShipBuildingPointsArr.pop();

                    if (points < 1) {
                        if (Math.max(this.freePoints.vedette) < 1) {
                            this.setState({
                                squares: this.squares
                            });
                            this.availableVals = null;
                            return;
                        }

                        let halo = calculateHalo(this.builtShipNumbers); //calculate halo around the built ship
                        this.reservedSquares = this.reservedSquares.concat(this.builtShipNumbers, halo);//new set?

                        this.builtShipNumbers = [];
                        let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
                        this.availableVals = newArr.filter(elem => !this.reservedSquares.includes(elem));

                        if (currentShipBuildingPointsArr.length === 0) {
                            this.shipKey--;
                            this.currentShip = this.ships[this.shipKey];
                        }
                    } else {
                        currentShipBuildingPointsArr.push(points);
                        /*this.setState({
                            freePoints: newPoints
                        });*/
                        this.freePoints =  newPoints;
                    }
                //}
            }

        }

        handleClick = (i) => {

        };

        render(){
            return (
                <WrappedBoard
                    squares={this.state.squares}
                    onClick={(i) => this.handleClick(i)}
                    reserved={this.reservedSquares}
                    {...this.props}/>
            )
        }
    }

    return EnemyBoard;
}



