import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';
import pluralize from 'pluralize';

declare type DiceSide = {
  success: number;
  advantage: number;
  failure: number;
  threat: number;
  triumph: number;
  despair: number;
  dark: number;
  light: number;
};

declare type Dice = { sides: DiceSide[] };

const BLANK: DiceSide = {
  success: 0,
  advantage: 0,
  failure: 0,
  threat: 0,
  triumph: 0,
  despair: 0,
  dark: 0,
  light: 0,
};

const sides: {
  BLANK: DiceSide;
  SUCCESS: DiceSide;
  SUCCESS_ADVANTAGE: DiceSide;
  SUCCESS_SUCCESS: DiceSide;
  ADVANTAGE: DiceSide;
  ADVANTAGE_ADVANTAGE: DiceSide;
  FAILURE: DiceSide;
  FAILURE_FAILURE: DiceSide;
  THREAT: DiceSide;
  THREAT_THREAT: DiceSide;
  FAILURE_THREAT: DiceSide;
  TRIUMPH: DiceSide;
  DESPAIR: DiceSide;
  DARK: DiceSide;
  DARK_DARK: DiceSide;
  LIGHT: DiceSide;
  LIGHT_LIGHT: DiceSide;
} = {
  BLANK,
  SUCCESS: { ...BLANK, success: 1 },
  SUCCESS_ADVANTAGE: { ...BLANK, success: 1, advantage: 1 },
  SUCCESS_SUCCESS: { ...BLANK, success: 2 },
  ADVANTAGE: { ...BLANK, advantage: 1 },
  ADVANTAGE_ADVANTAGE: { ...BLANK, advantage: 2 },
  FAILURE: { ...BLANK, failure: 1 },
  FAILURE_FAILURE: { ...BLANK, failure: 2 },
  THREAT: { ...BLANK, threat: 1 },
  THREAT_THREAT: { ...BLANK, threat: 2 },
  FAILURE_THREAT: { ...BLANK, failure: 1, threat: 1 },
  TRIUMPH: { ...BLANK, triumph: 1 },
  DESPAIR: { ...BLANK, despair: 1 },
  DARK: { ...BLANK, dark: 1 },
  DARK_DARK: { ...BLANK, dark: 2 },
  LIGHT: { ...BLANK, light: 1 },
  LIGHT_LIGHT: { ...BLANK, light: 2 },
};

const dice: {
  boost: Dice;
  setback: Dice;
  ability: Dice;
  difficulty: Dice;
  proficiency: Dice;
  challenge: Dice;
  force: Dice;
} = {
  boost: {
    sides: [
      sides.BLANK,
      sides.BLANK,
      sides.SUCCESS,
      sides.SUCCESS_ADVANTAGE,
      sides.ADVANTAGE_ADVANTAGE,
      sides.ADVANTAGE,
    ],
  },
  setback: {
    sides: [
      sides.BLANK,
      sides.BLANK,
      sides.FAILURE,
      sides.FAILURE,
      sides.THREAT,
      sides.THREAT,
    ],
  },
  ability: {
    sides: [
      sides.BLANK,
      sides.SUCCESS,
      sides.SUCCESS,
      sides.SUCCESS_SUCCESS,
      sides.ADVANTAGE,
      sides.ADVANTAGE,
      sides.SUCCESS_ADVANTAGE,
      sides.ADVANTAGE_ADVANTAGE,
    ],
  },
  difficulty: {
    sides: [
      sides.BLANK,
      sides.FAILURE,
      sides.FAILURE_FAILURE,
      sides.THREAT,
      sides.THREAT,
      sides.THREAT,
      sides.THREAT_THREAT,
      sides.FAILURE_THREAT,
    ],
  },
  proficiency: {
    sides: [
      sides.BLANK,
      sides.SUCCESS,
      sides.SUCCESS,
      sides.SUCCESS_SUCCESS,
      sides.SUCCESS_SUCCESS,
      sides.ADVANTAGE,
      sides.SUCCESS_ADVANTAGE,
      sides.SUCCESS_ADVANTAGE,
      sides.SUCCESS_ADVANTAGE,
      sides.ADVANTAGE_ADVANTAGE,
      sides.ADVANTAGE_ADVANTAGE,
      sides.TRIUMPH,
    ],
  },
  challenge: {
    sides: [
      sides.BLANK,
      sides.FAILURE,
      sides.FAILURE,
      sides.FAILURE_FAILURE,
      sides.FAILURE_FAILURE,
      sides.THREAT,
      sides.THREAT,
      sides.FAILURE_THREAT,
      sides.FAILURE_THREAT,
      sides.THREAT_THREAT,
      sides.THREAT_THREAT,
      sides.DESPAIR,
    ],
  },
  force: {
    sides: [
      sides.DARK,
      sides.DARK,
      sides.DARK,
      sides.DARK,
      sides.DARK,
      sides.DARK,
      sides.DARK_DARK,
      sides.LIGHT,
      sides.LIGHT,
      sides.LIGHT_LIGHT,
      sides.LIGHT_LIGHT,
      sides.LIGHT_LIGHT,
    ],
  },
};

declare type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

declare type DiceNames =
  | 'boost'
  | 'setback'
  | 'ability'
  | 'difficulty'
  | 'proficiency'
  | 'challenge'
  | 'force';

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const sumSides = (...sides: DiceSide[]): DiceSide => {
  return sides.reduce((a, b) => {
    return {
      success: a.success + b.success,
      advantage: a.advantage + b.advantage,
      failure: a.failure + b.failure,
      threat: a.threat + b.threat,
      triumph: a.triumph + b.triumph,
      despair: a.despair + b.despair,
      dark: a.dark + b.dark,
      light: a.light + b.light,
    };
  }, BLANK);
};

const sumResults = ({
  success,
  advantage,
  failure,
  threat,
  triumph,
  despair,
  dark,
  light,
}: DiceSide): DiceSide => {
  return {
    success: Math.max(success + triumph - (failure + despair), 0),
    advantage: Math.max(advantage - threat, 0),
    failure: Math.max(failure + despair - (success + triumph), 0),
    threat: Math.max(threat - advantage, 0),
    triumph: Math.max(triumph - despair, 0),
    despair: Math.max(despair - triumph, 0),
    dark,
    light,
  };
};

const rollDice = (dice: Dice): DiceSide =>
  dice.sides[Math.floor(Math.random() * dice.sides.length)];

const resultToString = (result: DiceSide): string => {
  return Object.entries(result)
    .map(([key, value]) => (value ? pluralize(key, value, true) : ''))
    .filter((value) => !!value)
    .join(', ');
};

function App() {
  const [result, setResult] = useState(BLANK);
  const [diceState, setDiceState] = useState({
    boost: 0,
    setback: 0,
    ability: 0,
    difficulty: 0,
    proficiency: 0,
    challenge: 0,
    force: 0,
  });

  const handleRoll: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    let rolls: DiceSide[] = [];

    Object.keys(dice).forEach((diceType) => {
      for (let i = 0; i < diceState[diceType as DiceNames]; i++) {
        rolls.push(rollDice(dice[diceType as DiceNames]));
      }
    });

    setResult(sumSides(...rolls));
  };

  const handleSetDiceState: React.ChangeEventHandler<FormControlElement> = (
    event
  ) => {
    setDiceState({
      ...diceState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className='App'>
      <Form onSubmit={handleRoll}>
        {Object.keys(dice).map((diceType) => {
          return (
            <Form.Group key={diceType + 'formgroup'}>
              <Form.Label>{`${capitalizeFirstLetter(
                diceType
              )} Die`}</Form.Label>
              <Form.Control
                type='number'
                min={0}
                step={1}
                value={diceState[diceType as DiceNames]}
                name={diceType}
                onChange={handleSetDiceState}
              />
            </Form.Group>
          );
        })}
        <Button type='submit'>Roll</Button>
      </Form>
      <div>The dice rolled: {resultToString(result)}</div>
      <div>The end result: {resultToString(sumResults(result))}</div>
      <div>
        * Sucesses from triumphs have been calculated as additional successes.
        <br />
        ** Failures from despairs have been calculated as additional failures.
      </div>
    </div>
  );
}

export default App;
