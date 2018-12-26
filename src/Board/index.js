import React, {Component} from 'react';
import Square from '../Square';
import './styles.css';

export default class Board extends Component {
    renderSquare = (i) => {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                number={i}
                enemy={this.props.enemy}
            />
        )
    };

    divideToRows(arr) {
        let rows = [];
        for (let i = 0; i < 100; i += 10) {
            let arrRow = arr.slice(i, i + 10);
            let row = arrRow.map((_, j) =>
                this.renderSquare(j + i)
            );
            rows.push(row);
        }
        return rows;
    }

    render() {
        let numHeaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let letterHeaders = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        let letters = letterHeaders.map((letter, i) =>
            <th className="letterHeader" key={letter}>{letter}</th>
        );

        let rows = this.divideToRows(this.props.squares);
        let table = rows.map((row, i) =>
            <tr className="row" key={i}>
                <th className="numHeader">{numHeaders[i]}</th>
                {row}
            </tr>
        );

        return (
            <table className="board">
                <tbody>
                <tr>{letters}</tr>
                {table}
                </tbody>
            </table>
        )
    }
}