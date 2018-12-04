import React, {Component} from 'react';
import './App.css';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';
import Header from './Header';
//import {calculateAvailableValues, calculateHalo} from './functions';

class App extends Component {
    /*build = (newPoints, obj, index) => {
        //let newPoints = Object.assign({}, this.state.freePoints); //make a copy of our state.freePoints

        let currentShipBuildingPointsArr = newPoints[this.currentShip];
        let points = currentShipBuildingPointsArr[currentShipBuildingPointsArr.length - 1];

        obj.newSquares[index] = true;
        this.builtShipNumbers.push(index);

        let availableVals = calculateAvailableValues(obj.builtShipNumbers);
        console.log('availableVals:' + availableVals);
        this.availableVals = availableVals.filter(elem => !this.reservedSquares.includes(elem));

        this.setState({
            squares: obj.newSquares
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
            let newArr = Array.from(Array(100).keys()); //arr with 100 numbered elems
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
    };*/

    render() {
        return (
            <>
                <Header/>
                <PlayerBoard/>
                <EnemyBoard/>
            </>
        )
    }
}

export default App;
