import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import FinishScreen from "./FinishScreen";

const TIME_PER_QUESTION = 1;

const initialState = {
  questions: [],

  // loading , ready, active , error , finished
  status: "loading",
  questionIndex: 0,
  userAnswerIndex: null,
  points: 0,
  highscore: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "userAnswerIndex":
      return {
        ...state,
        userAnswerIndex: action.payload,
        points:
          action.payload === action.payload2.correctOption
            ? state.points + action.payload2.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        userAnswerIndex: null,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        highscore: state.highscore,
      };

    default:
      throw new Error("unknown command");
  }
}

export default function App() {
  const [
    { questionIndex, status, questions, userAnswerIndex, points, highscore },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;

  const maxPossiblePoints = questions.reduce((t, n) => t + n.points, 0);

  useEffect(() => {
    fetch("http://localhost:8001/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {status === "active" && (
          <Question
            questions={questions}
            questionIndex={questionIndex}
            dispatch={dispatch}
            userAnswerIndex={userAnswerIndex}
            // key={questionIndex}
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            TIME_PER_QUESTION={TIME_PER_QUESTION}
          />
        )}
        {status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
