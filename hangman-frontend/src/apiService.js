import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const newGame = () => {
  return axios.post(`${API_URL}/game/new`);
};

export const getGameState = (id) => {
  return axios.get(`${API_URL}/game/${id}`);
};

export const makeGuess = (id, guess) => {
  return axios.post(`${API_URL}/game/${id}/guess`, { guess });
};

export const resetGame = (id) => {
  return axios.post(`${API_URL}/game/${id}/reset`);
};
