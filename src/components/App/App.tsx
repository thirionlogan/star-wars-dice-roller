import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';

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

const rollDice = (dice: Dice): DiceSide =>
  dice.sides[Math.floor(Math.random() * dice.sides.length)];

function App() {
  const diceTypes = [
    'Boost',
    'Setback',
    'Ability',
    'Difficulty',
    'Proficiency',
    'Challenge',
    'Force',
  ];

  const [result, setResult] = useState('');
  const [boostDie, setBoostDie] = useState(0);
  const [setbackDie, setSetbackDie] = useState(0);
  const [abilityDie, setAbilityDie] = useState(0);
  const [difficultyDie, setDifficultyDie] = useState(0);
  const [proficiencyDie, setProficiencyDie] = useState(0);
  const [challengeDie, setChallengeDie] = useState(0);
  const [forceDie, setForceDie] = useState(0);

  const handleRoll: React.FormEventHandler<HTMLFormElement> = (event) => {
    let rolls: DiceSide[] = [];

    for (let i = 0; i < boostDie; i++) {
      rolls.push(rollDice(dice.boost));
    }

    for (let i = 0; i < setbackDie; i++) {
      rolls.push(rollDice(dice.setback));
    }

    for (let i = 0; i < abilityDie; i++) {
      rolls.push(rollDice(dice.ability));
    }

    for (let i = 0; i < difficultyDie; i++) {
      rolls.push(rollDice(dice.difficulty));
    }

    for (let i = 0; i < proficiencyDie; i++) {
      rolls.push(rollDice(dice.proficiency));
    }

    for (let i = 0; i < challengeDie; i++) {
      rolls.push(rollDice(dice.challenge));
    }

    for (let i = 0; i < forceDie; i++) {
      rolls.push(rollDice(dice.force));
    }

    event.preventDefault();
    setResult(JSON.stringify(sumSides(...rolls)));
  };

  const handleSetBoostDie: React.ChangeEventHandler<FormControlElement> = (
    event
  ) => {
    setBoostDie(+event.target.value);
  };

  const handleSetSetbackDie: React.ChangeEventHandler<FormControlElement> = (
    event
  ) => {
    setSetbackDie(+event.target.value);
  };

  return (
    <div className='App'>
      <Form onSubmit={handleRoll}>
        <Form.Group>
          <Form.Label>Boost Die</Form.Label>
          <Form.Control
            type='number'
            min={0}
            step={1}
            value={boostDie}
            onChange={handleSetBoostDie}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Setback Die</Form.Label>
          <Form.Control
            type='number'
            min={0}
            step={1}
            value={setbackDie}
            onChange={handleSetSetbackDie}
          />
        </Form.Group>
        <Button type='submit'>Roll</Button>
      </Form>
      <div>Result: {result ? result : ''}</div>
    </div>
  );
}

/*
  TODO:
  Boost die (d6)
  Setback die (d6)
  Ability die (d8)
  Difficulty die (d8)
  Proficiency die (d12)
  Challenge die (d12)
  Force die (d12)
*/

export default App;
