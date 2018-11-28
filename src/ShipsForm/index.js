import React, {Component} from 'react';

export default class ShipsForm extends Component{
    render() {
        return(
            <form>
                <h3>Select the ship that you want to place</h3>
                <div>
                    <input id='battleship'
                           value='battleship'
                           type="radio"
                           name="ship"
                           onChange={this.props.handler}
                           checked = {this.props.shipChecked.battleship}
                    />

                    <label htmlFor="battleship">Battleship</label>
                </div>

                <div>
                    <input id='cruisers'
                           value='cruisers'
                           type="radio"
                           name="ship"
                           onChange={this.props.handler}
                           checked = {this.props.shipChecked.cruisers}
                    />

                    <label htmlFor="cruisers">Cruisers</label>
                </div>

                <div>
                    <input id='destroyers'
                           value='destroyers'
                           type="radio"
                           name="ship"
                           onChange={this.props.handler}
                           checked = {this.props.shipChecked.destroyers}
                    />

                    <label htmlFor="destroyers">Destroyers</label>
                </div>

                <div>
                    <input id='vedettes'
                           value='vedettes'
                           type="radio"
                           name="ship"
                           onChange={this.props.handler}
                           checked = {this.props.shipChecked.vedettes}
                    />

                    <label htmlFor="vedettes">Vedettes</label>
                </div>
            </form>
        )
    }
}