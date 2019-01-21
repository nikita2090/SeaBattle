import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import PlayerBoard from './Components/PlayerBoard';
import EnemyBoard from './Components/EnemyBoard';
import Tooltip from "./Components/Tooltip";
import {calculateAvailableValues, calculateHalo} from './functions';

class App extends Component {
    state = {
        playerSquares: new Array(100).fill('empty'),
        enemySquares: new Array(100).fill('empty'),
        playerFreePoints: {
            vedette: [1, 1, 1, 1],
            destroyer: [2, 2, 2],
            cruiser: [3, 3],
            battleship: [4]
        },
        playerTurn: null,
        winner: ''
    };

    constructor(props) {
        super(props);
        this.resetGameProperties();
    }

    resetGameProperties = () => {
        this.player = {
            currentShipForBuild: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
            builtShips: [],
            ships: Object.getOwnPropertyNames(this.state.playerFreePoints),
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
            currentShipForBuild: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
            builtShips: {
                vedette: [],
                destroyer: [],
                cruiser: [],
                battleship: []
            },
            builtShipsCopy: {},
            aliveShipsAmount: 10,

            currentShipForKill: [],
            alreadyShot: [],
            squaresForShot: Array.from(new Array(100).keys())
        };
        this.enemy.ships = Object.getOwnPropertyNames(this.enemy.freePoints);
        this.enemy.shipKey = this.enemy.ships.length - 1;
        this.enemy.currentShip = this.enemy.ships[this.enemy.shipKey];
    };

    startNewGame = () => {
        this.setState({
            playerSquares: new Array(100).fill('empty'),
            enemySquares: new Array(100).fill('empty'),
            playerFreePoints: {
                vedette: [1, 1, 1, 1],
                destroyer: [2, 2, 2],
                cruiser: [3, 3],
                battleship: [4]
            },
            playerTurn: null,
            winner: ''
        }, () => {
            this.resetGameProperties();
            this.buildEnemyShips();
        });
    };

    buildPlayerShips = (index) => {
        let {availableVals} = this.player;
        if (!availableVals) return;

        if (availableVals.length === 0) {
            alert('Your ship building deadlocked. Your board will be cleaned!');
            this.startNewGame();
        }

        if (availableVals.includes(index)) {
            this.build(index, true);
        }
    };

    buildEnemyShips = () => {
        while (this.enemy.freePoints.vedette.length) {
            let {availableVals} = this.enemy;
            let rand = Math.floor(Math.random() * availableVals.length);
            let randomAvaliableValue = availableVals[rand];

            if (isNaN(randomAvaliableValue)) {
                this.startNewGame();
                return;
            }

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

        target.currentShipForBuild.push(index);

        let availableVals = calculateAvailableValues(target.currentShipForBuild);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));

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
            let halo = calculateHalo(target.currentShipForBuild);
            target.reservedSquares = target.reservedSquares.concat(target.currentShipForBuild, halo);

            let vedettsAmount;
            if (playerFlag) {
                target.builtShips = target.builtShips.concat(target.currentShipForBuild);
                vedettsAmount = this.state.playerFreePoints.vedette
            } else {
                target.builtShips[target.currentShip].push(target.currentShipForBuild);
                target.builtShipsCopy = JSON.parse(JSON.stringify(target.builtShips));
                vedettsAmount = this.enemy.freePoints.vedette
            }

            if (Math.max(...vedettsAmount) < 1) {
                if (playerFlag) {
                    this.player.availableVals = null;
                    this.setState({
                        playerTurn: true
                    });
                } else {


                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                }
                return;
            }

            target.currentShipForBuild = [];
            let newArr = Array.from(new Array(100).keys());
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

    handleEnemyBoardClick = (index) => {
        let {winner, playerTurn, enemySquares} = this.state;
        if (winner) return;
        let newEnemySquares = enemySquares.slice();
        if (playerTurn) {
            if (newEnemySquares[index] === 'boat') {
                newEnemySquares[index] = 'killed';
                let {builtShips} = this.enemy;
                for (let kindOfShip in builtShips) {
                    if (builtShips.hasOwnProperty(kindOfShip)) {
                        let currentShipKindArr = builtShips[kindOfShip];
                        currentShipKindArr.forEach(arr => {
                            arr.forEach(elem => {
                                if (elem === index) {
                                    let elemNumber = arr.indexOf(elem);
                                    arr.splice(elemNumber, 1);

                                    if (arr.length < 1) {
                                        let arrNumber = currentShipKindArr.indexOf(arr);
                                        let {builtShipsCopy} = this.enemy;
                                        let halo = calculateHalo(builtShipsCopy[kindOfShip][arrNumber]);
                                        halo.forEach(square => {
                                            newEnemySquares[square] = 'miss';
                                        });
                                        this.enemy.aliveShipsAmount--;
                                    }
                                }
                            });
                        });
                    }
                }

                this.setState({
                    enemySquares: newEnemySquares
                });

                if (!this.enemy.aliveShipsAmount) {
                    this.setState({
                        winner: 'Player'
                    });
                }
            } else if (newEnemySquares[index] === 'empty') {
                newEnemySquares[index] = 'miss';
                this.setState({
                    enemySquares: newEnemySquares,
                    playerTurn: false
                });
            }
        }
    };

    letEnemyTurn = () => {
        let {winner, playerTurn, playerSquares} = this.state;
        if (winner) return;
        let newSquares = playerSquares.slice();
        let candidatesForKill, isShipKilled;
        while (!winner && playerTurn === false) {
            let {squaresForShot, currentShipForKill, alreadyShot} = this.enemy;
            let rand = Math.floor(Math.random() * squaresForShot.length);
            let randomSquareForShot = squaresForShot[rand];

            if (newSquares[randomSquareForShot] === 'boat') {
                newSquares[randomSquareForShot] = 'killed';
                let {builtShips} = this.player;
                let elemNumber = builtShips.indexOf(newSquares[randomSquareForShot]);
                builtShips.splice(elemNumber, 1);
                if (builtShips.length < 1) {
                    winner = 'Enemy';
                    this.setState({
                        winner: winner
                    });
                }
                this.player.builtShips = builtShips;

                currentShipForKill.push(randomSquareForShot);
                candidatesForKill = calculateAvailableValues(currentShipForKill);
                isShipKilled = !candidatesForKill.some(square => newSquares[square] === 'boat');
                alreadyShot.push(randomSquareForShot);

                if (isShipKilled) {
                    let halo = calculateHalo(currentShipForKill);
                    alreadyShot = alreadyShot.concat(halo);
                    halo.forEach(square => {
                        newSquares[square] = 'miss';
                    });
                    squaresForShot = Array.from(new Array(100).keys());
                    currentShipForKill = [];
                } else {
                    squaresForShot = candidatesForKill;
                }
            } else if (newSquares[randomSquareForShot] === 'empty') {
                alreadyShot.push(randomSquareForShot);
                if (currentShipForKill.length < 1) {
                    squaresForShot = Array.from(new Array(100).keys());
                }
                newSquares[randomSquareForShot] = 'miss';
                playerTurn = true;
            }
            squaresForShot = squaresForShot.filter(elem => !alreadyShot.includes(elem));
            this.enemy.squaresForShot = squaresForShot;
            this.enemy.currentShipForKill = currentShipForKill;
            this.enemy.alreadyShot = alreadyShot;
            this.setState({
                playerTurn: playerTurn,
                playerSquares: newSquares
            });
        }
    };

    render() {
        let {playerFreePoints, winner, playerSquares, enemySquares} = this.state;
        return (
            <>
            <header>
                <div className="container">
                    <div className="row justify-content-center">
                        <h1 className="header col-xl-12">Sea Battle</h1>
                    </div>
                    <div className="row justify-content-center">
                        <Tooltip
                            playerFreePoints={playerFreePoints}
                            winner={winner}/>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="row justify-content-center">
                        <PlayerBoard className="col"
                                     squares={playerSquares}
                                     build={this.buildPlayerShips}/>
                        <EnemyBoard className="col"
                                    squares={enemySquares}
                                    build={this.buildEnemyShips}
                                    turn={this.letEnemyTurn}
                                    handleEnemyBoardClick={this.handleEnemyBoardClick}/>
                    </div>
                    <div className="row justify-content-center">
                        <button className="button col-xl-6 col-sm-8 col-xxs-10"
                                onClick={this.startNewGame}>
                            Clean boards and start New Game
                        </button>
                    </div>
                </div>
            </main>
            </>
        )
    }
}

export default App;
