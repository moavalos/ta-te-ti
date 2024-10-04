import './App.css';
import React from 'react';
import { useState } from 'react';

/*representa un cuadrado de la square. value toma los valores x/o
onSquareClick se ejecuta cuando se hace clic en el cuadrado*/
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/* alterna entre x y o y se encarga de los cliks*/
function Board({ xIsNext, squares, onPlay }) {
  // se maneja el fucking click. si ya hay un ganador o el cuadrado está ocupado, no hace nada.
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i])
      return;

    const nextSquares = squares.slice(); // copia del array
    if (xIsNext) {
      nextSquares[i] = 'X'; 
    } else {
      nextSquares[i] = 'O'; 
    }
    onPlay(nextSquares); // actualizo el estado
  }

  // verificar si hay winner eaaaa
  const winner = calculateWinner(squares);
  
  // si hay ganador o no, se actualiza el estadito
  let status;
  if (winner) {
    status = 'winner: ' + winner;
  } else {
    status = 'siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// historial y "deshacer" partidas maneja el historial de jugadas
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // array de 9 valores vacios
  
  // jugador siguiente
  const [currentMove, setCurrentMove] = useState(0);
  
  // si el numero de jugadas es par juega x, sino juega O
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // se actualiza el fucking historial
    setCurrentMove(nextHistory.length - 1); 
  }

  // moverse a una jugada anterior o al inicio del game
  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // la jugada actual es la seleccionada
  }

  // "volver a jugadas anteriores" 
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'ir a la jugada #' + move;
    } else {
      description = 'inicio del fucking juego';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // renderiza lista de movimientos
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  // este for d mierda recorre todas las jugadas ganadoras y dice si alguna esta completa
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // devuelve si ganó x o O
    }
  }
  return null; 
}