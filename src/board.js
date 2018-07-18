import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

const Square = ({ onClick, value }) => (
  <button type="button" className="square" onClick={onClick}>
    {value}
  </button>
);

Square.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
};
Square.defaultProps = {
  onClick: Function.prototype,
  value: String.prototype,
};

class Board extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  static propTypes = {
    squares: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
  }

  static defaultProps = {
    squares: Array.prototype,
    onClick: Function.prototype,
  }

  renderSquare = (i) => {
    const { squares, onClick } = this.props;
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
      />
    );
  }

  render() {
  // const winner = calculateWinner(this.state.squares)
  // let status;
  // if (winner) {
  //   status = 'Winner: ' + winner;
  // } else {
  //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  // }

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default Board;
