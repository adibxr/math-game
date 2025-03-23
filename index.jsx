import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, XCircle } from "lucide-react";
import useSound from "use-sound";
import "game.css";

const questions = [
  { question: "5 + 3", answer: 8, options: [6, 7, 8, 9] },
  { question: "10 - 4", answer: 6, options: [5, 6, 7, 8] },
  { question: "7 x 2", answer: 14, options: [12, 13, 14, 15] },
  { question: "16 / 4", answer: 4, options: [3, 4, 5, 6] },
];

export default function MathGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [shake, setShake] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  const [playCorrect] = useSound("/sounds/correct.mp3");
  const [playWrong] = useSound("/sounds/wrong.mp3");

  const handleAnswerSubmit = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedAnswer === correctAnswer) {
      playCorrect();
      setScore(score + 1);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      playWrong();
      setShake(true);
      setLives(lives - 1);
      setIncorrectQuestions([...incorrectQuestions, questions[currentQuestionIndex].question]);
      setTimeout(() => setShake(false), 500);
      if (lives - 1 === 0) {
        setGameOver(true);
      }
    }
  };

  return (
    <div className="container">
      {gameOver ? (
        <Card className="game-over-card">
          <h2 className="game-over-title">Game Over</h2>
          <p className="score">Your score: {score}</p>
          <p className="incorrect-title">Incorrect Answers:</p>
          <ul>
            {incorrectQuestions.map((q, index) => (
              <li key={index} className="incorrect-question">{q}</li>
            ))}
          </ul>
          <Button onClick={() => { setLives(3); setScore(0); setIncorrectQuestions([]); setCurrentQuestionIndex(0); setGameOver(false); }}>
            Restart
          </Button>
        </Card>
      ) : (
        <Card className="game-card">
          <CardContent>
            <div className="lives-container">
              {Array.from({ length: lives }, (_, i) => (
                <Heart key={i} className="heart-icon" />
              ))}
            </div>
            <h2 className="question-text">{questions[currentQuestionIndex].question}</h2>
            <div className="options-container">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Button key={index} onClick={() => handleAnswerSubmit(option)}>{option}</Button>
              ))}
            </div>
            <p className="score-text">Score: {score}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
