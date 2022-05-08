import React, { useEffect, useState, useCallback } from 'react';
import useInterval from '../hooks/useInterval';
import secondsToTimes from '../utils/secondsToTime';
import Button from './Button';
import Timer from './Timer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

const PomodoroTimer = (props: Props): JSX.Element => {
  const [mainTime, setMainTime] = useState(props.pomodoroTimer);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManeger, setCyclesQtdManeger] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTimer);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTimer,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManeger.length > 0) {
      configureRest(false);
      cyclesQtdManeger.pop();
    } else if (working && cyclesQtdManeger.length <= 0) {
      configureRest(true);
      setCyclesQtdManeger(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    configureRest,
    setCyclesQtdManeger,
    configureWork,
    cyclesQtdManeger,
    numberOfPomodoros,
    props.cycles,
    completedCycles,
    setFullWorkingTime,
  ]);

  return (
    <div className="pomodoro">
      <h2>Voce esta: {working ? 'Estudando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Estudar" onClick={() => configureWork()} />
        <Button text="Descansar" onClick={() => configureRest(false)} />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pausar' : 'Iniciar'}
          onClick={() => setTimeCounting(!timeCounting)}
        />
      </div>
      <div className="details">
        <p>Ciclos concluidos: {completedCycles} </p>
        <p>Horas estudadas: {secondsToTimes(fullWorkingTime)} </p>
        <p>Pomodoros concluidos: {numberOfPomodoros} </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
