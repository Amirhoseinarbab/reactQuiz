import Timer from "./Timer";
function Question({
  questions,
  questionIndex,
  dispatch,
  userAnswerIndex,
  maxPossiblePoints,
  points,
  TIME_PER_QUESTION
}) {
  const question = questions.at(questionIndex);
  // console.log("🚀 ~ file: Question.js:3 ~ Question ~ question:", question)
  const hasAnswered = userAnswerIndex !== null;
  const lastQuestion = questionIndex === questions.length - 1;

  return (
    <div>
      {/* ProgressBar Section */}

      <header className="progress">
        <progress
          max={questions.length}
          value={questionIndex + Number(userAnswerIndex !== null)}
        />

        <p>
          Question <strong>{questionIndex + 1}</strong> / {questions.length}
        </p>

        <p>
          <strong>{points}</strong> / {maxPossiblePoints}
        </p>
      </header>

      {/* Question Section */}
      <h4>{question.question}</h4>

      <div className="options">
        {question.options.map((option, index) => (
          <button
            className={`btn btn-option ${
              hasAnswered
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            } ${index === userAnswerIndex && "answer"}  `}
            key={option}
            onClick={() =>
              !hasAnswered &&
              dispatch({
                type: "userAnswerIndex",
                payload: index,
                payload2: question,
              })
            }
            // disabled={hasAnswered}
          >
            {option}
          </button>
        ))}
      </div>

          
      <Timer numQuestions={questions.length} dispatch={dispatch} TIME_PER_QUESTION={TIME_PER_QUESTION} />

      {hasAnswered &&
        !lastQuestion &&(
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "nextQuestion" })}
          >
            Next
          </button>
        )}

      {hasAnswered &&
        lastQuestion&&(
          <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "finished" })}
          >
            Finish
          </button>
        )}
    </div>
  );
}

export default Question;
