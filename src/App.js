import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3.js";
import lottery from "./lottery.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      players: [],
      bal: "",
      value: "",
      message: "",
      contract: ""
    };
  }
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const contract = await lottery.options.address;
    this.setState({ manager, players, bal: balance, contract });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "waiting for the transaction" });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "Successful" });
  };
  onClick = async () => {
    this.setState({ message: "waiting for the transaction" });
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ message: "Successfully picked a winner!!" });
  };
  render() {
    console.log(lottery.methods);
    console.log(web3.eth);

    return (
      <div className="App">
        <div>
          <img src={logo} />
        </div>
        <h2>The contract is managed by : {this.state.manager}</h2>
        <h3>{this.state.players.length} players have entered the lottery</h3>
        <h4>
          balance:
          {web3.utils.fromWei(this.state.bal, "ether")}
        </h4>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Lottery</h4>
          <div>
            Amount:{" "}
            <input
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />

        <h2>{this.state.message}</h2>
        <button onClick={this.onClick}>Pick a Winner</button>
        <h5>{this.state.contract}</h5>
        
      </div>
    );
  }
}

export default App;
