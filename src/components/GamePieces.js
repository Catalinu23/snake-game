import { useRef, useState, useEffect } from "react";

const GamePieces = ({onGameOver}) => {
    const canvasRef = useRef();
    const SPEED = 10;
    const [apple, setApple] = useState({x:180, y:100});
    const [snake, setSnake] = useState([{x:100, y:50}, {x:95, y:50}]);
    const [direction, setDirection] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const drawSnake = () => {
            snake.forEach((snakePart) => {
                context.beginPath();
                context.rect(snakePart.x, snakePart.y, 10, 10);
                context.fillStyle = "#000000";
                context.fill();
                context.closePath();
            });
        }

        const drawApple = () => {
            context.beginPath();
            context.rect(apple.x, apple.y, 10, 10);
            context.fillStyle = "#000000";
            context.fill();
            context.closePath();
        }

        const moveSnake = () => {
            if(direction) {
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const snakeHead = {x: newSnake[0].x, y: newSnake[0].y};

                    for(let i = newSnake.length - 1; i > 0; i --) {
                        newSnake[i].x = newSnake[i-1].x;
                        newSnake[i].y = newSnake[i-1].y;
                    }

                    switch(direction) {
                        case "right":
                            snakeHead.x += SPEED;
                            break;
                        case "left":
                            snakeHead.x -= SPEED;
                            break;
                        case "up":
                            snakeHead.y -= SPEED;
                            break;
                        case "down":
                            snakeHead.y += SPEED;
                            break;
                        default:
                            break;
                    }

                    newSnake[0] = snakeHead;
                    handleAppleCollision(newSnake);
                    handleWallCollision(snakeHead);
                    handleBodyCollision(newSnake);

                    return newSnake
                })
            }
        }

        const handleWallCollision = (snakeHead) => {
            if (snakeHead.x + SPEED > canvas.width || snakeHead.x + SPEED < 0) {
                onGameOver("wall");
            }
            if(snakeHead.y + SPEED > canvas.height || snakeHead.y + SPEED < 0) {
                onGameOver("wall");
            }
          };
      
        const handleBodyCollision = (newSnake) => {
            const snakeHead = newSnake[0];
            for (let i = 1; i < newSnake.length; i++) {
                if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
                    onGameOver("self"); 
                }
            }
        };

        const handleAppleCollision = (newSnake) => {

            const snakeHead = newSnake[0]

            if(snakeHead.x === apple.x && snakeHead.y === apple.y) {
                setApple({
                    x: Math.floor((Math.random() * canvas.width) / SPEED) * SPEED,
                    y: Math.floor((Math.random() * canvas.height) / SPEED) * SPEED
                })

                newSnake.push({
                    x: newSnake[newSnake.length - 1].x,
                    y: newSnake[newSnake.length - 1].y
                })
            }
        }

        const handleKeyPress = (e) => {
            if(!gameStarted) {
                if(e.key === "Tab") {
                    setGameStarted(true);
                }
            } else {
                switch(e.key) {
                    case "ArrowRight":
                        setDirection("right");
                        break;
                    case "ArrowLeft":
                        setDirection("left");
                        break;
                    case "ArrowUp":
                        setDirection("up");
                        break;
                    case "ArrowDown":
                        setDirection("down");
                        break;
                    default:
                        break;
                }
            }
            
        }

        window.addEventListener("keydown", handleKeyPress);

        const interval = setInterval(() => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            drawSnake();
            drawApple();
            moveSnake();
        }, 100)

        return () => {
            clearInterval(interval);
        }
    })

    return (
        <div>
            <canvas className="gameCanvas" ref={canvasRef} width={750} height={420}/>
        </div>
    );
}

export default GamePieces;