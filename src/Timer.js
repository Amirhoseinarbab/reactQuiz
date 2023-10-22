import { useEffect, useState } from "react";

export default function Timer({numQuestions , dispatch , TIME_PER_QUESTION}) {

  const [remainTime, setRemainTime] = useState(numQuestions * TIME_PER_QUESTION);


  if( remainTime === 0) dispatch({type:"finished"})
  
  
  const mins = Math.floor(remainTime / 60);
  const seconds = remainTime % 60;

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainTime(remainTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainTime]); //baresi

  return <div className="timer"> {mins < 10 && "0"}
  {mins}:{seconds < 10 && "0"}
  {seconds}</div>;
}
