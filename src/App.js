import React, {Component} from 'react';
import './App.css';
import Board from './Board/index';
//import ShipsForm from './ShipsForm';
import Header from './Header';
import Tooltip from './Tooltip';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: new Array(100).fill(false),
            freePoints: {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            },
        };
        this.buildedShipNumbers = [];
        this.reservedSquares = [];
        this.availableVals = Array.from(Array(100).keys());
        this.ships = Object.getOwnPropertyNames(this.state.freePoints);
        this.shipKey = this.ships.length - 1;
        this.currentShip = this.ships[this.shipKey];
    }

    handleClick = (i) => {
        let newSquares = this.state.squares.slice(); //make a copy of our state.squares

        if (!this.availableVals) return;
        for (let val of this.availableVals) {
            if (val === i) {
                let newPoints = Object.assign({}, this.state.freePoints); //make a copy of our state.freePoints
                let currentShipBuildingPoints = newPoints[this.currentShip];
                let points = currentShipBuildingPoints[currentShipBuildingPoints.length - 1];

                newSquares[i] = true;
                this.buildedShipNumbers.push(i);

                let availableVals = calculateAvailableValues(this.buildedShipNumbers);
                this.availableVals = availableVals.filter(elem => !this.reservedSquares.includes(elem));

                this.setState({
                    squares: newSquares
                });

                points--;
                currentShipBuildingPoints.pop();
                if (points < 1) {
                    if (Math.max(this.state.freePoints.vedette) < 1) {
                        setTimeout(() => {
                            alert('Ships are ready!');
                        }, 0);
                        this.availableVals = null;
                        return;
                    }

                    let halo = calculateHalo(this.buildedShipNumbers); //calculate halo around the builded ship
                    this.reservedSquares = this.reservedSquares.concat(this.buildedShipNumbers, halo);//new set?

                    this.buildedShipNumbers = [];
                    let newArr = Array.from(Array(100).keys()); //arr with 100 numbered elems
                    this.availableVals = newArr.filter(elem => !this.reservedSquares.includes(elem));

                    if (currentShipBuildingPoints.length === 0) {
                        this.shipKey--;
                        this.currentShip = this.ships[this.shipKey];
                    }
                } else {
                    currentShipBuildingPoints.push(points);
                    this.setState({
                        freePoints: newPoints
                    });
                }
                break;
            }
        }
    };

    render() {
        return (
            <>
            <Header/>
            <Tooltip value={this.state.freePoints}/>
            <Board
                squares={this.state.squares}
                onClick={(i) => this.handleClick(i)}
                reserved={this.reservedSquares}/>
            </>
        )
    }
}


function calculateAvailableValues(arrOfClickedElems) {
    let minVal = Math.min(...arrOfClickedElems);
    let maxVal = Math.max(...arrOfClickedElems);
    let result;
    let dif = maxVal - minVal;
    if (dif === 0) {
        result = [minVal - 1, minVal + 1, minVal - 10, minVal + 10];
    } else {
        if (dif === 1 || dif === 2) {
            minVal--;
            maxVal++;
        } else if (dif === 10 || dif === 20) {
            minVal = minVal - 10;
            maxVal = maxVal + 10;
        }
        result = [minVal, maxVal];
    }
    return result;
}

function calculateHalo(arr) {
    let minVal = Math.min(...arr);
    let maxVal = Math.max(...arr);
    let leftBorder = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    let rightBorder = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
    let result = [minVal - 10, minVal + 10];
    let leftBorderFlag;
    let RightBorderFlag;

    checkBorders(minVal);
    let dif = maxVal - minVal;
    if (dif === 1 || dif === 2 || dif === 3 || dif === 10 || dif === 20 || dif === 30) {
        result = result.concat([maxVal - 10, maxVal + 10]);
        checkBorders(maxVal);
    }
    return result.filter((elem) => elem >= 0 && elem < 100);

    function checkBorders(value) {
        leftBorderFlag = leftBorder.some((borderElem) => borderElem === value);
        if (!leftBorderFlag) result = result.concat([value - 1, value - 11, value + 9]);

        RightBorderFlag = rightBorder.some((borderElem) => borderElem === value);
        if (!RightBorderFlag) result = result.concat([value + 1, value + 11, value - 9]);
    }
}

export default App;
