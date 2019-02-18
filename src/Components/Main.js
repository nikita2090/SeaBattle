import React, {Component} from 'react';

import Row from './Row';
import Container from './Container';
import Button from './Button';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';
import Tooltip from './Tooltip';
import {calculateAvailableValues, calculateHalo} from '../functions';

class Main extends Component {
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

        //warn user if he deadlocked, clean borders and start new game
        if (availableVals.length === 0) {
            alert('Your ship building deadlocked. Your board will be cleaned!');
            this.startNewGame();
        }

        if (availableVals.includes(index)) {
            this.build(index, true);
        }
    };

    buildEnemyShips = () => {
        //repeat while we have free building points
        while (this.enemy.freePoints.vedette.length) {
            let {availableVals} = this.enemy;
            let rand = Math.floor(Math.random() * availableVals.length); //random value from interval
            let randomAvaliableSquare = availableVals[rand];

            //rebuilding when enemy ships deadlocked and enemy building phase not finished
            if (isNaN(randomAvaliableSquare)) {
                this.startNewGame();
                return;
            }

            this.build(randomAvaliableSquare, false);
        }
    };

    build = (index, playerFlag) => {
        let target, newSquares, newPoints;

        if (playerFlag) {
            target = this.player;
            newSquares = [...this.state.playerSquares];
            newPoints = {...this.state.playerFreePoints};
        } else {
            target = this.enemy;
            newSquares = [...this.enemy.squares];
            newPoints = {...this.enemy.freePoints};
        }

        let currentShipBuildingPointsArr = newPoints[target.currentShip];//arr of current ship type points
        let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];//current ship points

        target.currentShipForBuild.push(index); //save part of building ship

        let availableVals = calculateAvailableValues(target.currentShipForBuild);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem)); //exclude reserved squares

        newSquares[index] = 'boat';

        if (playerFlag) {
            this.setState({
                playerSquares: newSquares
            });
        } else {
            this.enemy.squares = newSquares;
        }

        points--; //decrease current ship points
        currentShipBuildingPointsArr.pop();

        //if current ship built, calculate halo, save ship and its halo in reservedSquares
        if (points < 1) {
            let halo = calculateHalo(target.currentShipForBuild);
            target.reservedSquares = [...target.reservedSquares, ...target.currentShipForBuild, ...halo]; //include halo in reserved squares

            let vedettsAmount;
            if (playerFlag) {
                target.builtShips = [...target.builtShips, ...target.currentShipForBuild];
                vedettsAmount = this.state.playerFreePoints.vedette
            } else {
                target.builtShips[target.currentShip].push(target.currentShipForBuild);
                target.builtShipsCopy = JSON.parse(JSON.stringify(target.builtShips));
                vedettsAmount = this.enemy.freePoints.vedette
            }


            if (Math.max(...vedettsAmount) < 1) {
                if (playerFlag) {
                    //if player built all ships, let him play
                    this.player.availableVals = null;
                    this.setState({
                        playerTurn: true
                    });
                } else {
                    //if enemy built all ships, re-render enemy board
                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                }
                return;
            }

            target.currentShipForBuild = [];
            let newArr = Array.from(new Array(100).keys());
            target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));// exclude reserved squares

            //if points of current ship type are 0, change current type of ship
            if (currentShipBuildingPointsArr.length === 0) {
                target.shipKey--;
                target.currentShip = target.ships[target.shipKey];
            }
        } else {
            //update current ship points amount
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

                //search for killed square
                //and delete it from array of builtShips
                let {builtShips} = this.enemy;
                for (let kindOfShip in builtShips) {
                    if (builtShips.hasOwnProperty(kindOfShip)) {
                        let currentShipKindArr = builtShips[kindOfShip];
                        currentShipKindArr.forEach(arr => {
                            arr.forEach(elem => {
                                if (elem === index) {
                                    let elemNumber = arr.indexOf(elem);
                                    arr.splice(elemNumber, 1);

                                    //if all part of ship killed, calculate and display halo
                                    // and then decrease alive ships amount
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

                //if all enemy ships killed set winner
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
            let rand = Math.floor(Math.random() * squaresForShot.length); //random number from interval
            let randomSquareForShot = squaresForShot[rand];

            if (newSquares[randomSquareForShot] === 'boat') {
                newSquares[randomSquareForShot] = 'killed';
                let {builtShips} = this.player;

                //delete killed square from array of builtShips
                let elemNumber = builtShips.indexOf(newSquares[randomSquareForShot]);
                builtShips.splice(elemNumber, 1);

                //if all player ships are killed, set winner
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

                //if current ship killed, display its halo
                //next shot will be random
                if (isShipKilled) {
                    let halo = calculateHalo(currentShipForKill);
                    alreadyShot = [...alreadyShot, ...halo];
                    halo.forEach(square => {
                        newSquares[square] = 'miss';
                    });
                    squaresForShot = Array.from(new Array(100).keys());
                    currentShipForKill = [];
                } else {
                    //next shot will be to some of near squares
                    squaresForShot = candidatesForKill;
                }
            } else if (newSquares[randomSquareForShot] === 'empty') {
                //save this miss and highlight it on the board
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
                <main>
                    <Container>
                        <Row>
                            <Tooltip
                                playerFreePoints={playerFreePoints}
                                winner={winner}/>
                        </Row>

                        <Row>
                            <PlayerBoard
                                squares={playerSquares}
                                onClick={this.buildPlayerShips}/>

                            <EnemyBoard
                                squares={enemySquares}
                                build={this.buildEnemyShips}
                                turn={this.letEnemyTurn}
                                onClick={this.handleEnemyBoardClick}/>
                        </Row>

                        <Row>
                            <Button onClick={this.startNewGame}>
                                Clean boards and start New Game
                            </Button>
                        </Row>
                    </Container>
                </main>
            </>
        )
    }
}

export default Main;
