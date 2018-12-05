import React, {Component} from 'react';
import './App.css';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';
import Header from './Header';
import {calculateAvailableValues, calculateHalo} from './functions';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerSquares: new Array(100).fill(false),
            enemySquares: new Array(100).fill(false),
            playerFreePoints: {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            }
        };

        this.player = {
            builtShipNumbers: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
            ships: Object.getOwnPropertyNames(this.state.playerFreePoints)
        };
        this.player.shipKey = this.player.ships.length - 1;
        this.player.currentShip = this.player.ships[this.player.shipKey];

        this.enemy = {
            squares: new Array(100).fill(false),
            freePoints: {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            },
            builtShipNumbers: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
        };
        this.enemy.ships = Object.getOwnPropertyNames(this.enemy.freePoints);
        this.enemy.shipKey = this.enemy.ships.length - 1;
        this.enemy.currentShip = this.enemy.ships[this.enemy.shipKey];
    }

    forPlayer = (index) => {
        let newSquares = this.state.playerSquares.slice(); //make a copy of our state.squares

        if (!this.player.availableVals) return;
        if (this.player.availableVals.includes(index)) {
            let newPoints = Object.assign({}, this.state.playerFreePoints); //make a copy of our state.freePoints
            this.build(index, newSquares, newPoints, true)
        }
    };

    forEnemy = () => {
        for (let i = 0; i < 20; i++) {
            //console.log('length:' + this.availableVals.length);
            let rand = Math.floor(Math.random() * this.enemy.availableVals.length);
            //console.log('RANDOM:'+rand);
            let randomAvaliableValue = this.enemy.availableVals[rand];

            let newSquares = this.enemy.squares.slice(); //make a copy of our state.squares
            // console.log(newSquares);
            if (!this.enemy.availableVals) return;

            let newPoints = Object.assign({}, this.enemy.freePoints);

            this.build(randomAvaliableValue, newSquares, newPoints, false);
            console.log(this.enemy.builtShipNumbers);
        }
    };

    build = (index, newSquares, newPoints, playerFlag) => {
        let target;
        if (playerFlag) {
            target = this.player;
        } else {
            target = this.enemy;
        }
        let currentShipBuildingPointsArr = newPoints[target.currentShip];
        console.log(target);
        let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];

        newSquares[index] = true;
        target.builtShipNumbers.push(index);

        let availableVals = calculateAvailableValues(target.builtShipNumbers);
        console.log('availableVals:' + availableVals);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));

        if (playerFlag) {
            this.setState({
                playerSquares: newSquares
            });
        } else {
            this.enemy.squares = newSquares;
        }

        points--;
        currentShipBuildingPointsArr.pop();
        if (points < 1) {
            let vedettsAmount;
            if (playerFlag) {
                vedettsAmount = this.state.playerFreePoints.vedette
            } else {
                vedettsAmount = target.freePoints.vedette
            }
            if (Math.max(vedettsAmount) < 1) {
                if (!playerFlag) {
                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                }
                target.availableVals = null;
                return;
            }

            let halo = calculateHalo(target.builtShipNumbers); //calculate halo around the builded ship
            target.reservedSquares = target.reservedSquares.concat(target.builtShipNumbers, halo);//new set?
            //console.log(this.reservedSquares);

            target.builtShipNumbers = [];
            let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
            target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));

            if (currentShipBuildingPointsArr.length === 0) {
                target.shipKey--;
                target.currentShip = target.ships[target.shipKey];
            }
        } else {
            currentShipBuildingPointsArr.push(points);

            if (playerFlag) {
                this.setState({
                    freePoints: newPoints
                });
            } else {
                target.freePoints = newPoints;
            }

        }
    };

    render() {
        return (
            <>
            <Header/>
            <PlayerBoard
                squares={this.state.playerSquares}
                freePoints={this.state.playerFreePoints}
                build={this.forPlayer}/>
            <EnemyBoard
                squares={this.state.enemySquares}
                build={this.forEnemy}
            />
            </>
        )
    }
}

export default App;
