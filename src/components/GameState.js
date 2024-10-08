import {useState, useEffect} from "react";
import GamePieces from "./GamePieces";


const GameState = () => {
    const [gameOver, setGameOver] = useState(false);
    const [collision, setCollisionType] = useState(null);

    
    const handleGameOver = (type) => {
        setGameOver(true);
        setCollisionType(type);
    };
    
    const handleResetGame = () => {
        setGameOver(false);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        const handleKeyPress = async(e) => {
            if (e.key === "r") {
                handleGameOver("reset");
                await delay(10);
                handleResetGame();
            }
        };
    
        window.addEventListener("keydown", handleKeyPress);
    
      });

    return (
        <div>
            {gameOver && (
                <div className="game-over">
                    <p>Game Over!</p>
                    <p>Press R to reset the game.</p>
                </div>
                )
            }{
                !gameOver && (
                    <div>

                        <p>Press TAB to start</p>
                        <p>Press R to restart</p>

                        <GamePieces
                        onGameOver={(type) => handleGameOver(type)}
                        />
                    </div>
                )
            }
        </div>
    );
}

export default GameState;