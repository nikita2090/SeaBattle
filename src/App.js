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
            playerSquares: new Array(100).fill('empty'),
            enemySquares: new Array(100).fill('empty'),
            playerFreePoints: {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            },
            playerTurn: true
        };
        this.playerTurn = true;

        this.player = {
            builtShipNumbers: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
            ships: Object.getOwnPropertyNames(this.state.playerFreePoints)
        };
        this.player.shipKey = this.player.ships.length - 1;
        this.player.currentShip = this.player.ships[this.player.shipKey];

        this.enemy = {
            squares: new Array(100).fill('empty'),
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

    forPlayerBuilding = (index) => {
        if (!this.player.availableVals) return;
        if (this.player.availableVals.includes(index)) {
            this.build(index, true);
        }
    };

    forEnemyBuilding = () => {
        while (this.enemy.freePoints.vedette.length > 0) {
            let rand = Math.floor(Math.random() * this.enemy.availableVals.length);
            let randomAvaliableValue = this.enemy.availableVals[rand];
            this.build(randomAvaliableValue, false);
        }
    };

    build = (index, playerFlag) => {
        let target, newSquares, newPoints;

        if (playerFlag) {
            target = this.player;
            newSquares = this.state.playerSquares.slice();
            newPoints = Object.assign({}, this.state.playerFreePoints);
        } else {
            target = this.enemy;
            newSquares = this.enemy.squares.slice();
            newPoints = Object.assign({}, this.enemy.freePoints);
        }

        let currentShipBuildingPointsArr = newPoints[target.currentShip];
        let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];


        let vedettsAmount;
        if (playerFlag) {
            vedettsAmount = this.state.playerFreePoints.vedette
        } else {
            vedettsAmount = target.freePoints.vedette
        }

        target.builtShipNumbers.push(index);
        let availableVals = calculateAvailableValues(target.builtShipNumbers);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));
        if (!playerFlag && !target.availableVals.length && target.builtShipNumbers.length > 0 && !(target.builtShipNumbers[target.builtShipNumbers.length - 1])) {
            alert('EnemyBoard BUG');
            this.setState({
                enemySquares: new Array(100).fill('empty'),
            });

            this.enemy = {
                squares: new Array(100).fill('empty'),
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
            return;
        }

        newSquares[index] = 'boat';
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
            if (Math.max(...vedettsAmount) < 1) {
                if (!playerFlag) {
                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                }
                //target.availableVals = null;
                return;
            }

            let halo = calculateHalo(target.builtShipNumbers); //calculate halo around the builded ship
            target.reservedSquares = target.reservedSquares.concat(target.builtShipNumbers, halo);//new set?

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

    forEnemyBoardClick = (index) => {
        let newEnemySquares = this.state.enemySquares.slice();
        if (this.state.playerTurn && this.state.enemySquares[index] === 'boat') {
            newEnemySquares[index] = 'killed';
            this.setState({
                enemySquares: newEnemySquares
            });
        } else if (this.state.enemySquares[index] === 'empty') {
            newEnemySquares[index] = 'miss';
            this.playerTurn = false;
            this.setState({
                enemySquares: newEnemySquares,
                playerTurn: this.playerTurn
            });
        }
    };

    letEnemyTurn = () => {
        let newPlayerSquares = this.state.playerSquares.slice();
        while (!this.playerTurn) {
            let rand = Math.floor(Math.random() * this.state.playerSquares.length);
            if (newPlayerSquares[rand] === 'boat') {
                newPlayerSquares[rand] = 'killed';
            } else if (newPlayerSquares[rand] === 'empty') {
                newPlayerSquares[rand] = 'miss';
                this.playerTurn = true;
            }

            this.setState({
                playerTurn: this.playerTurn,
                playerSquares: newPlayerSquares
            });
        }
    };

    render() {
        return (
            <>
            <Header/>
            <PlayerBoard
                squares={this.state.playerSquares}
                freePoints={this.state.playerFreePoints}
                build={this.forPlayerBuilding}/>
            <EnemyBoard
                squares={this.state.enemySquares}
                build={this.forEnemyBuilding}
                turn={this.letEnemyTurn}
                forEnemyBoardClick={this.forEnemyBoardClick}/>
            </>
        )
    }
}

export default App;
