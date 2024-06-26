"use client"
import React, { useState, useEffect } from "react";
import styles from './page.module.css'
import apiInstance from "@/instances/apiInstance";
import { start } from "repl";

const Home: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [inputBoardSize, setInputBoardSize] = useState<number>(3);
  const [board, setBoard] = useState<string[][]>([]);
  const [moves, setMoves] = useState<any>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<string>("");
  const [whoWin, setWhoWin] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [isReplaying, setIsReplaying] = useState<boolean>();

  useEffect(() => {
    fetchData();
  }, []);

  const startGame = () => {
    const size = Math.max(3, inputBoardSize);
    setCurrentPlayer("X");
    setPlayerTurn(`Player X's Turn`);
    setWhoWin("");
    setGameOver(false);
    setBoardSize(size);
    createBoard(size);
    setMoves([]);
    setIsReplaying(false)
  };

  const createBoard = (size: number) => {
    const newBoard = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );
    setBoard(newBoard);
  };

  const makeMove = async (row: number, col: number, player: string = currentPlayer) => {
    if (board[row][col] === "" && !gameOver && !isReplaying) {
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? player : cell))
      );
      const newMove = [...moves, { player: player, row: row, col: col }];
      setMoves(newMove);
      setBoard(newBoard);

      if (checkWin(newBoard, player)) {
        setWhoWin(`Player ${player} Wins!`);
        setGameOver(true);
        await handleGameEnd(player, newMove);
      } else if (checkDraw(newBoard)) {
        setWhoWin("It's a Draw!");
        setGameOver(true);
        await handleGameEnd('Draw', newMove);
      } else {
        const nextPlayer = player === "X" ? "O" : "X";
        setCurrentPlayer(nextPlayer);
        setPlayerTurn(`Player ${nextPlayer}'s Turn`);
      }
    }
  };

  const handleGameEnd = async (winner: string, moves: any[]) => {
    try {
      const response = await apiInstance.request({
        method: 'post',
        url: '/match',
        data: {
          board: boardSize,
          winner: winner,
          moves: moves
        }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await apiInstance.request({
        method: 'get',
        url: '/match'
      });
      const data = await res.data;
      setHistory(data);
      console.log("Match history:", data);
    } catch (error) {
      console.error("Error fetching match history:", error);
    }
  };

  const replayMatch = async (matchIndex: string) => {
    try {
      if (isReplaying) {
        setIsReplaying(false);
        return;
      }

      setIsReplaying(true);
      const selectedMatch = history.find(match => match._id === matchIndex);

      setCurrentPlayer("X");
      setPlayerTurn(`Player X's Turn`);
      setWhoWin("");
      setGameOver(false);
      setBoardSize(Math.max(3, selectedMatch.board));
      createBoard(Math.max(3, selectedMatch.board));
      setMoves([]);

      for (let i = 0; i < selectedMatch.moves.length; i++) {
        const { row, col, player } = selectedMatch.moves[i];

        await new Promise((resolve) => setTimeout(resolve, 500));

        setBoard(prevBoard => {
          const newBoard = prevBoard.map(row => [...row]);
          newBoard[row][col] = player;
          return newBoard;
        });

        setMoves((prevMoves: any) => [...prevMoves, { player, row, col }]);
        setCurrentPlayer(player);
        setPlayerTurn(`Player ${player}'s Turn`);
      }
      await setWhoWin('Player ' + selectedMatch.winner + ' Won!');

    } catch (error) {
      console.error(error);
    }
  };



  const checkWin = (board: string[][], player: string): boolean => {
    const size = board.length;
    for (let i = 0; i < size; i++) {
      if (board[i].every((cell) => cell === player)) return true;
      if (board.every((row) => row[i] === player)) return true;
    }

    if (board.every((row, i) => row[i] === player)) return true;
    if (board.every((row, i) => row[size - 1 - i] === player)) return true;

    return false;
  };

  const checkDraw = (board: string[][]): boolean => {
    return board.flat().every((cell) => cell !== "");
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div>
        <h1 style={{ textAlign: "center" }}>Tic Tac Toe</h1>
        <label htmlFor="BoardSize">Board Size : </label>
        <input
          type="number"
          id="BoardSize"
          min="3"
          value={inputBoardSize}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setInputBoardSize(isNaN(value) ? 3 : value);
          }}
        />

        <button onClick={() => {
          startGame();
        }}>Start Game</button>
        <div style={{ textAlign: 'center', margin: 10 }}>
          <select value={selectedMatch} onChange={(e) => {
            setSelectedMatch(e.target.value);
          }}>
            <option value="">Select a match</option>
            {history.map((match, index) => (
              <option key={match._id} value={match._id}>
                Match {history.length - index}
              </option>
            ))}
          </select>



          <button onClick={() => replayMatch(selectedMatch)}>Replay Match</button>
        </div>
        <p id="PlayerTurn">{playerTurn}</p>
        <div
          id="board"
          className={styles.board}
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 100px)`,
            gridTemplateRows: `repeat(${boardSize}, 100px)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={styles.cell}
                data-row={rowIndex}
                data-col={colIndex}
                onClick={() => makeMove(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
        <h1 className={styles.whowin}>{whoWin}</h1>
      </div>
    </div>
  );
};

export default Home;
