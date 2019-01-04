import React, {Component} from 'react';
import './App.css';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';
import Header from './Header';
import {calculateAvailableValues, calculateHalo, calculateAdjacentSquares} from './functions';
import Tooltip from "./Tooltip/index";

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
            playerTurn: null,
            winner: null
        };

        this.resetGameProperties();
    }

    resetGameProperties = () => {
        this.player = {
            currentShipForBuild: [],
            reservedSquares: [],
            availableVals: Array.from(new Array(100).keys()),
            builtShips: [],
            ships: Object.getOwnPropertyNames(this.state.playerFreePoints),
            currentShipForKill: [],
            candidatesForKill: []
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
            builtShips: [],

            currentShipForKill: [],
            alreadyShot: [],
            squaresForShot: Array.from(new Array(100).keys())
        };
        this.enemy.ships = Object.getOwnPropertyNames(this.enemy.freePoints);
        this.enemy.shipKey = this.enemy.ships.length - 1;
        this.enemy.currentShip = this.enemy.ships[this.enemy.shipKey];
    };

    resetGameStates = () => {
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
            winner: null
        });
    };

    startNewGame = () => {
        this.resetGameProperties();
        this.resetGameStates();
        this.buildEnemyShips();
    };

    buildPlayerShips = (index) => {
        if (!this.player.availableVals) return;
        if (this.player.availableVals.includes(index)) {
            this.build(index, true);
        }
    };

    buildEnemyShips = () => {
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

        target.currentShipForBuild.push(index);

        let availableVals = calculateAvailableValues(target.currentShipForBuild);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));

        if (!playerFlag && !target.availableVals.length && target.currentShipForBuild.length > 0 && !(target.currentShipForBuild[target.currentShipForBuild.length - 1])) {
            //console.log('BBBBBBBBUUUUUUUUUUUUUUUUUUUUUGGGGGGGGGGGG');
            /*target.currentShipForBuild.pop();
            if (target.currentShipForBuild.length < 1) {
                let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
                target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));
            } else {
                availableVals = calculateAvailableValues(target.currentShipForBuild);
                target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));
            }
            newSquares[index] = true;
            if (playerFlag) {
                this.setState({
                    playerSquares: newSquares
                });
            } else {
                this.enemy.squares = newSquares;
            }*/
            /*let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
            target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));
            console.log('BUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUG');
            if (!playerFlag) {
                this.setState({
                    enemySquares: this.enemy.squares
                });
            }*/
            //return;

            alert('EnemyBoard BUG. Rebuilding!');
            this.setState({
                enemySquares: new Array(100).fill('empty'),
            });
            this.resetGameProperties();
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
            let halo = calculateHalo(target.currentShipForBuild); //calculate halo around the builded ship
            target.reservedSquares = target.reservedSquares.concat(target.currentShipForBuild, halo);//new set?
            target.builtShips = target.builtShips.concat(target.currentShipForBuild);

            if (Math.max(...vedettsAmount) < 1) {
                if (!playerFlag) {
                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                } else {
                    this.player.availableVals = null;
                    this.setState({
                        playerTurn: true
                    });
                }
                return;
            }

            target.currentShipForBuild = [];
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
        if (this.state.winner) return;
        let newEnemySquares = this.state.enemySquares.slice();
        if (this.state.playerTurn) {
            if (newEnemySquares[index] === 'boat') {
                newEnemySquares[index] = 'killed';
                let elemNumber = this.enemy.builtShips.indexOf(newEnemySquares[index]);
                this.enemy.builtShips.splice(elemNumber, 1);
                if (this.enemy.builtShips.length < 1){
                    this.setState({
                        winner: 'Player'
                    });
                }

                this.player.currentShipForKill.push(index);

                let adjacentSqures = calculateAdjacentSquares(index);
                this.player.candidatesForKill = this.player.candidatesForKill.concat(adjacentSqures);

                let isShipKilled = !this.player.candidatesForKill.some(square => newEnemySquares[square] === 'boat');

                if (isShipKilled) {
                    let halo = calculateHalo(this.player.currentShipForKill);
                    halo.forEach(square => {
                        newEnemySquares[square] = 'miss';
                    });
                    this.player.candidatesForKill = [];
                    this.player.currentShipForKill = [];
                }
                this.setState({
                    enemySquares: newEnemySquares
                });
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
        if (this.state.winner) return;
        let newPlayerTurn = this.state.playerTurn;
        let newSquares = this.state.playerSquares.slice();
        let candidatesForKill, isShipKilled;
        while (!this.state.winner && newPlayerTurn === false) {
            let rand = Math.floor(Math.random() * this.enemy.squaresForShot.length);
            let randomSquareForShot = this.enemy.squaresForShot[rand];

            if (newSquares[randomSquareForShot] === 'boat') {
                newSquares[randomSquareForShot] = 'killed';

                let elemNumber = this.player.builtShips.indexOf(newSquares[randomSquareForShot]);
                this.player.builtShips.splice(elemNumber, 1);
                if (this.player.builtShips.length < 1){
                    this.setState({
                        winner: 'Enemy'
                    });
                }

                this.enemy.currentShipForKill.push(randomSquareForShot);
                candidatesForKill = calculateAvailableValues(this.enemy.currentShipForKill);
                isShipKilled = !candidatesForKill.some(square => newSquares[square] === 'boat');
                this.enemy.alreadyShot.push(randomSquareForShot);
                if (isShipKilled) {
                    let halo = calculateHalo(this.enemy.currentShipForKill);
                    this.enemy.alreadyShot = this.enemy.alreadyShot.concat(halo);
                    halo.forEach(square => {
                        newSquares[square] = 'miss';
                    });
                    this.enemy.squaresForShot = Array.from(new Array(100).keys());
                    this.enemy.currentShipForKill = [];
                } else {
                    this.enemy.squaresForShot = candidatesForKill;
                }
            } else if (newSquares[randomSquareForShot] === 'empty') {
                this.enemy.alreadyShot.push(randomSquareForShot);
                if (this.enemy.currentShipForKill.length < 1) {
                    this.enemy.squaresForShot = Array.from(new Array(100).keys());
                }
                newSquares[randomSquareForShot] = 'miss';
                newPlayerTurn = true;
            }
            this.enemy.squaresForShot = this.enemy.squaresForShot.filter(elem => !this.enemy.alreadyShot.includes(elem));
            this.setState({
                playerTurn: newPlayerTurn,
                playerSquares: newSquares
            });
        }
    };

    render() {
        return (
            <>
            <Header/>
            <Tooltip
                value={this.state.playerFreePoints}
                winner={this.state.winner}
            />
            <button onClick={this.startNewGame}>New Game</button>
            <PlayerBoard
                squares={this.state.playerSquares}
                freePoints={this.state.playerFreePoints}
                build={this.buildPlayerShips}
                winner={this.state.winner}/>
            <EnemyBoard
                squares={this.state.enemySquares}
                build={this.buildEnemyShips}
                turn={this.letEnemyTurn}
                forEnemyBoardClick={this.forEnemyBoardClick}/>
            </>
        )
    }
}

export default App;

