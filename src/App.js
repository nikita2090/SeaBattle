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
            playerTurn: null,

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

            currentShipForKill: [],
            alreadyShot: [],
            squaresForShot: Array.from(new Array(100).keys())
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
        //console.log('target.builtShipNumbers' + target.builtShipNumbers);
        //console.log('target.builtShipNumbersLASTelem' + target.builtShipNumbers[target.builtShipNumbers.length - 1]);

        let availableVals = calculateAvailableValues(target.builtShipNumbers);
        console.log('availableVals:' + availableVals);
        target.availableVals = availableVals.filter(elem => !target.reservedSquares.includes(elem));

        //console.log('reservedSquares:' + target.reservedSquares);
        //console.log('availableValsFilter:' + target.availableVals);

        if (!playerFlag && !target.availableVals.length && target.builtShipNumbers.length > 0 && !(target.builtShipNumbers[target.builtShipNumbers.length - 1])) {
            //console.log('BBBBBBBBUUUUUUUUUUUUUUUUUUUUUGGGGGGGGGGGG');
            /*target.builtShipNumbers.pop();
            if (target.builtShipNumbers.length < 1) {
                let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
                target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));
            } else {
                availableVals = calculateAvailableValues(target.builtShipNumbers);
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

                currentShipForKill: [],
                alreadyShot: [],
                squaresForShot: Array.from(new Array(100).keys())
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
            //console.log('points<1');
            if (Math.max(...vedettsAmount) < 1) {
                if (!playerFlag) {
                    this.setState({
                        enemySquares: this.enemy.squares
                    });
                } else {
                    this.setState({
                        playerTurn: true
                    });
                }
                return;
            }

            let halo = calculateHalo(target.builtShipNumbers); //calculate halo around the builded ship
            target.reservedSquares = target.reservedSquares.concat(target.builtShipNumbers, halo);//new set?

            target.builtShipNumbers = [];
            let newArr = Array.from(new Array(100).keys()); //arr with 100 numbered elems
            target.availableVals = newArr.filter(elem => !target.reservedSquares.includes(elem));
            //console.log('av:' + target.availableVals);
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
        if (this.state.playerTurn) {
            if (newEnemySquares[index] === 'boat') {
                newEnemySquares[index] = 'killed';
                this.setState({
                    enemySquares: newEnemySquares
                });
                //console.log(this.state.playerTurn);
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
        let newPlayerTurn = this.state.playerTurn;
        let newSquares = this.state.playerSquares.slice();
        let candidatesForKill, isShipKilled;
        while (newPlayerTurn === false) {
            let rand = Math.floor(Math.random() * this.enemy.squaresForShot.length);
            console.log(rand);

            let randomSquareForShot = this.enemy.squaresForShot[rand];
            console.log(randomSquareForShot);

            if (newSquares[randomSquareForShot] === 'boat') {
                newSquares[randomSquareForShot] = 'killed';
                console.log('killed');

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
                console.log('miss');
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
