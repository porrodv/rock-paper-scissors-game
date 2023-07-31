import './App.css';
import { useState, useEffect } from 'react';
import { animated, useTransition } from '@react-spring/web';
import { Square } from './components/Square';
import { CustomModal } from './components/CustomModal';

const options = {
  R: '✊',
  P: '🖐️',
  S: '✌️'
};

const winnerMap = {
  RP: options.P,
  PR: options.P,
  PS: options.S,
  SP: options.S,
  SR: options.R,
  RS: options.R
};

function App () {
  const [userSelection, setUserSelection] = useState(null);
  const [botSelection, setBotSelection] = useState(null);
  const [globalWinner, setGobalWinner] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [botPoints, setBotPoints] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    if (userPoints !== 0 || botPoints !== 0) checkGlobalWinner(3);
  }, [userPoints, botPoints]);

  useEffect(() => {
    if (globalWinner != null) handleShowFinishModal();
  }, [globalWinner]);

  const handleSelection = (selectedValue) => {
    if (globalWinner === null) {
      const newBotSelection = getRandomOption();
      setUserSelection(selectedValue);
      setBotSelection(newBotSelection);
      checkWinner(selectedValue, newBotSelection);
    }
  };

  function getRandomOption () {
    const optionKeys = Object.keys(options);
    const randomKey = optionKeys[Math.floor(Math.random() * optionKeys.length)];
    const randomValue = options[randomKey];

    return randomValue;
  }

  function checkWinner (userSelection, botSelection) {
    const userKey = Object.keys(options).find(
      (key) => options[key] === userSelection
    );
    const botKey = Object.keys(options).find(
      (key) => options[key] === botSelection
    );
    const winnerKey = userKey + botKey;
    const winnerValue = winnerMap[winnerKey];

    if (winnerValue === userSelection) {
      setUserPoints((prevUserPoints) => prevUserPoints + 1);
    } else if (winnerValue === botSelection) {
      setBotPoints((prevBotPoints) => prevBotPoints + 1);
    }
  }

  function checkGlobalWinner (points) {
    if (userPoints === points) {
      setGobalWinner('User');
    } else if (botPoints === points) {
      setGobalWinner('Bot');
    }
  }

  function resetGame () {
    setUserSelection(null);
    setBotSelection(null);
    setGobalWinner(null);
    setUserPoints(0);
    setBotPoints(0);
  }

  const handleShowFinishModal = () => {
    setShowFinishModal(!showFinishModal);
  };

  const userPointsTransition = useTransition(userPoints, {
    from: { opacity: 0 },
    enter: { opacity: 1 }
  });
  const botPointsTransition = useTransition(botPoints, {
    from: { opacity: 0 },
    enter: { opacity: 1 }
  });

  return (
    <>
      <section className='restart'>
        <button className='btn-restart' onClick={resetGame}>
          Restart
        </button>
      </section>
      <section className='selects'>
        <div className='user-container'>
          {userPointsTransition((style, item) => (
            <animated.h2 className='points' style={style}>
              {item}
            </animated.h2>
          ))}

          <div className='square user-select'>{userSelection}</div>
          <h3>YOU</h3>
        </div>

        <h3 className='vs'>VS</h3>

        <div className='bot-container'>
          {botPointsTransition((style, item) => (
            <animated.h2 className='points' style={style}>
              {item}
            </animated.h2>
          ))}
          <div className='square bot-select'>{botSelection}</div>
          <h3>BOT</h3>
        </div>
      </section>

      <section className='user'>
        {Object.values(options).map((option) => (
          <Square key={option} value={option} onSelect={handleSelection} />
        ))}
      </section>

      {showFinishModal && (
        <CustomModal id={1} onModalToggle={handleShowFinishModal}>
          <div
            className='win-modal'
            style={{ display: 'flex', height: '200px' }}
          >
            <h2>{globalWinner} wins</h2>
            <button
              className='btn-restart'
              onClick={() => {
                resetGame();
                handleShowFinishModal();
              }}
            >
              Restart
            </button>
          </div>
        </CustomModal>
      )}
    </>
  );
}

export default App;
