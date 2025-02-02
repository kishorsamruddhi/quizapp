import React, { useState, useRef, useEffect } from "react";
import { data } from "./assets/data"; // Importing questions and answers

function QuizApp() {
    const [index, setIndex] = useState(0); // Current question index
    const [question, setQuestion] = useState(data[index]); // Current question object
    const [lock, setLock] = useState(false); // Lock to prevent multiple answers
    const [score, setScore] = useState(0); // User score
    const [result, setResult] = useState(false); // For checking if quiz is completed
    const [timer, setTimer] = useState(30); // Timer for each question
    const [correctAnswers, setCorrectAnswers] = useState(0); // Count of correct answers
    const [totalQuestions, setTotalQuestions] = useState(data.length); // Number of questions to display

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = [Option1, Option2, Option3, Option4];

    useEffect(() => {
        if (timer > 0 && !lock) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval); // Cleanup the interval on unmount
        } else if (timer === 0) {
            next();  // Move to the next question when time runs out
        }
    }, [timer, lock]);

    const checkAns = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add("Correct");
                setScore(prev => prev + 1);
                setCorrectAnswers(prev => prev + 1);
            } else {
                e.target.classList.add("Wrong");
                option_array[question.ans - 1].current.classList.add("Correct");
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock === true || timer === 0) {  // Make sure time out moves to the next question
            if (index === totalQuestions - 1) {
                setResult(true);
                return;
            }
            setIndex(prev => prev + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            setTimer(30); // Reset timer for the next question
            option_array.forEach(option => {
                option.current.classList.remove("Wrong", "Correct");
            });
        }
    };

    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setCorrectAnswers(0);
        setLock(false);
        setResult(false);
        setTimer(30);
    };

    const handleQuestionChange = (event) => {
        const selectedValue = parseInt(event.target.value);
        setTotalQuestions(selectedValue);
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setCorrectAnswers(0);
        setLock(false);
        setResult(false);
        setTimer(30);
    };

    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    return (
        <div className="quiz-container">
            <div className="quiz-title-container">
                <h2>QUIZ | DO YOUR BEST</h2>
                <div className="timer-container">
                    <div className="timer">{timer}s</div>
                </div>
                <hr />
                {!result && (
                    <div className="question-count-container">
                        <label htmlFor="question-count" className="question-count-label">Select the Number of Questions:</label>
                        <select
                            id="question-count"
                            onChange={handleQuestionChange}
                            value={totalQuestions}
                            className="question-count-select"
                        >
                            {[5, 10, 15, 20].map(num => (
                                <option key={num} value={num}>{num} Questions</option>
                            ))}
                        </select>
                    </div>
                )}
                {result ? (
                    <>
                        <h2 className="score" style={{ textAlign: "center" }}>You Scored {score} out of {totalQuestions}</h2>
                        <div className="accuracy-container" style={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "20px" }}>
                            <h3>Accuracy: {accuracy}%</h3>
                        </div>
                        <button className="reset-btn" onClick={reset} style={{ display: "block", margin: "20px auto" }}>Reset</button>
                    </>
                ) : (
                    <>
                        <div>
                            <h3 className="question">{index + 1}. {question.question}</h3>
                            <ul className="options">
                                <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
                                <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question.option2}</li>
                                <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
                                <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
                            </ul>
                        </div>
                        <button onClick={next} className="next-btn">Next</button>
                        <div className="quiz-index">{index + 1} out of {totalQuestions} questions</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizApp;
