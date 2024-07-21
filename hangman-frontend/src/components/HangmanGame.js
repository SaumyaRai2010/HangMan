import React, { useState, useCallback } from "react";
import { newGame, getGameState, makeGuess, resetGame } from "../apiService";

const HangmanGame = () => {
  const [gameId, setGameId] = useState(null); //the ID of the current game
  const [gameState, setGameState] = useState({}); //stores the state of the game, including the revealed word, incorrect guesses, and game status
  const [guess, setGuess] = useState(""); //stores the user's current guess
  const [message, setMessage] = useState(""); //displays messages such as errors or game results
  const [isDarkMode, setIsDarkMode] = useState(false); //manages the dark mode toggle state

  // we wrap toggleDarkMode in useCB because we don't need to call it on every render (every time state changes)
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  // starts a new game
  const startNewGame = useCallback(async () => {
    try {
      const response = await newGame();
      setGameId(response.data.id);
      fetchGameState(response.data.id);
    } catch (error) {
      console.error("Error starting a new game:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch game state
  const fetchGameState = useCallback(async (id) => {
    try {
      const response = await getGameState(id);
      setGameState(response.data);
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  }, []);

  //handles any guesses made by the player
  const handleGuess = useCallback(async () => {
    if (guess.length !== 1 || !/^[a-zA-Z]$/.test(guess)) {
      setMessage("Invalid guess. Please enter a single alphabet.");
      return;
    }
    try {
      const response = await makeGuess(gameId, guess);
      setGameState(response.data);
      if (response.data.state === "Won") {
        setMessage("Congratulations! You won!");
      } else if (response.data.state === "Lost") {
        setMessage(`Game over! The word was ${response.data.word}`);
      } else if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setMessage(""); // Clear message if the game is still in progress
      }
    } catch (error) {
      console.error("Error making a guess:", error);
      setMessage("An unexpected error occurred.");
    }
    setGuess("");
  }, [guess, gameId]);

  // resets the game
  const handleResetGame = useCallback(async () => {
    try {
      await resetGame(gameId);
      setGameId(null);
      setGameState({});
      setGuess("");
      setMessage("");
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  }, [gameId]);

  const isGameOver = gameState.state === "Won" || gameState.state === "Lost";

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="absolute top-4 right-4 flex items-center cursor-pointer">
        <div
          onClick={toggleDarkMode}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
            isDarkMode ? "bg-gray-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDarkMode ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="ml-2 text-sm">
          {isDarkMode ? "Dark" : "Light"} Mode
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-4">Hangman Game</h1>

      {gameId ? (
        <div
          className={`p-6 rounded-lg shadow-md w-full max-w-md ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Word: {gameState.revealed_word}
          </p>

          <p
            className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
          >
            Incorrect Guesses: {gameState.incorrect_guesses}
          </p>

          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
          >
            Remaining Incorrect Guesses: {gameState.remaining_incorrect_guesses}
          </p>

          {!isGameOver && (
            <div className="flex flex-col items-center space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className={`border p-2 rounded w-12 text-center ${
                    isDarkMode
                      ? "border-gray-600 text-gray-900"
                      : "border-gray-900 text-gray-900"
                  }`}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  maxLength={1}
                />
                <button
                  onClick={handleGuess}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Guess
                </button>
              </div>
            </div>
          )}

          <p
            className={`mt-2 ${
              gameState.state === "Won"
                ? isDarkMode
                  ? "text-green-400" // Lighter green for dark mode
                  : "text-green-700" // Darker green for light mode
                : gameState.state === "Lost"
                ? isDarkMode
                  ? "text-red-300" // Lighter red for dark mode
                  : "text-red-700" // Darker red for light mode
                : isDarkMode
                ? "text-red-300" // Lighter red for dark mode
                : "text-red-700"
            }`}
          >
            {message}
          </p>

          <button
            onClick={handleResetGame}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4"
          >
            Reset Game
          </button>
        </div>
      ) : (
        <button
          onClick={startNewGame}
          className="bg-green-500 text-white p-4 rounded hover:bg-green-600"
        >
          Start New Game
        </button>
      )}
    </div>
  );
};

export default HangmanGame;
