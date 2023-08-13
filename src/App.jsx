import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";

import "./App.css";

export function App() {
    const [game, setGame] = useState({
        number: Math.floor(Math.random() * 1000),
        loser: false,
        winner: false,
        cells: Array(10).fill(null),
        showInstructions: false,
    });

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            generateNumber();
        } else if (e.code === "KeyR") {
            resetGame();
        }
    });

    useEffect(() => {
        if (game.cells.every((cell) => cell)) {
            setGame({
                ...game,
                winner: true,
            });
        }
    }, [game.cells]);

    const [draggedNumber, setDraggedNumber] = useState(null);

    const setLevel = (level) => {
        setGame({
            ...game,
            cells: Array(level).fill(null),
        });
    };

    const checkCellSelectability = (index) => {
        if (!game.number) return false;
        if (game.cells.every((cell) => !cell)) return true;

        let start = 0;
        let end = 0;

        for (let i = 0; i < game.cells.length; i++) {
            const cell = game.cells[i];

            if (cell) {
                if (game.number < cell) {
                    end = i - 1;
                    break;
                } else {
                    start = i + 1;
                }
            } else if (i === game.cells.length - 1) {
                end = i;
                break;
            }
        }

        if (start > end) {
            game.loser = true;
            return;
        }

        return index >= start && index <= end;
    };

    const selectCell = (cell, index) => {
        if (cell) return;

        setGame({
            ...game,
            cells: game.cells.map((cell, i) =>
                i === index ? game.number : cell
            ),
            number: null,
        });
    };

    const generateNumber = () => {
        if (game.number !== null) return;

        setGame({
            ...game,
            number: Math.floor(Math.random() * 1000),
        });
    };

    const resetGame = () => {
        setGame({
            ...game,
            number: Math.floor(Math.random() * 1000),
            loser: false,
            winner: false,
            cells: Array(game.cells.length).fill(null),
        });
    };

    const onDragStart = (e) => {
        e.dataTransfer.setData("text/plain", game.number);
        setDraggedNumber(game.number);
    };

    const onDragEnd = (e) => {
        setDraggedNumber(null);

        e.target.classList.remove("drag-over");
    };

    const onDragOver = (e, index) => {
        e.preventDefault();

        if (!checkCellSelectability(index)) return;

        e.target.classList.add("drag-over");
    };

    const onDragLeave = (e) => {
        e.target.classList.remove("drag-over");
    };

    const onDrop = (e, index) => {
        e.preventDefault();

        if (!checkCellSelectability(index)) return;

        const droppedNumber = parseInt(e.dataTransfer.getData("text/plain"));
        const updatedCells = [...game.cells];

        updatedCells[index] = droppedNumber;

        setGame({ ...game, number: null, cells: updatedCells });
    };

    return (
        <main>
            <p className="title">Blind Number Challenge</p>
            <div className={`game ${game.cells.length === 2 && "little"}`}>
                <div
                    className={`buttons ${
                        game.cells.length === 2 && "little-buttons"
                    }`}
                >
                    <button onClick={() => setLevel(2)}>2</button>
                    <button onClick={() => setLevel(5)}>5</button>
                    <button onClick={() => setLevel(10)}>10</button>

                    <button
                        onClick={() =>
                            setGame({
                                ...game,
                                showInstructions: !game.showInstructions,
                            })
                        }
                    >
                        ?
                    </button>

                    <button onClick={resetGame}>
                        <AiOutlineReload size={23.7} />
                    </button>
                </div>

                <div className="game-board">
                    {game.cells.map((cell, index) => (
                        <div
                            key={index}
                            className={`${
                                cell
                                    ? "cell selected"
                                    : checkCellSelectability(index)
                                    ? "cell-selectable"
                                    : "cell-disabled"
                            }`}
                            onClick={() =>
                                checkCellSelectability(index) &&
                                selectCell(cell, index)
                            }
                            onDragOver={(e) => onDragOver(e, index)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, index)}
                        >
                            {cell ? cell : index + 1}
                        </div>
                    ))}
                </div>

                <div className="instructions">
                    {game.showInstructions && (
                        <>
                            <p>R - Reload</p>
                            <p>Space - Generate Number</p>
                        </>
                    )}
                </div>
            </div>

            <div className="loser">{game.loser && "YOU LOST"}</div>
            {game.number ? (
                <p
                    draggable={!game.loser && !game.winner}
                    className={`number ${game.loser && "button-loser"}`}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                >
                    {game.number}
                </p>
            ) : game.winner ? (
                <p className="winner">YOU WON</p>
            ) : (
                <button className="generate-number" onClick={generateNumber}>
                    GENERATE NUMBER
                </button>
            )}
        </main>
    );
}
