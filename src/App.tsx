import { useCallback, useEffect, useState } from 'react';
import words from './wordList.json';
import HangmanDraw from './component/HangmanDraw';
import HangmanWord from './component/HangmanWord';
import Keyboard from './component/Keyboard';

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)]
  });

  const [guessLetters, setGuessLetters] = useState<string[]>([]);

  // take and filter the letters we guess
  const incorrectLetters = guessLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const addGuessLetter = useCallback((letter: string) => {
    if (guessLetters.includes(letter)) {
      return
    } else {
      setGuessLetters(currentLetters => [...currentLetters, letter])
    }
  }, [guessLetters])

  // keyboard event handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) {
        return
      } else {
        e.preventDefault()
        addGuessLetter(key)
      }
    }

    document.addEventListener('keypress', handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessLetters])

  return (
    <div style={{
      maxWidth: '800px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '2rem',
      margin: '1rem auto'
    }}>
      <div style={{
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        Lose
        Win
      </div>
      {/* I want to know how many times I chose the wrong letter */}
      <HangmanDraw numberOfGuess={incorrectLetters.length} />
      <HangmanWord guessLetters={guessLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: 'stretch' }}>
        <Keyboard 
        activeLetter={guessLetters.filter(letter => wordToGuess.includes(letter))}
        inactiveLetter={incorrectLetters}
        addGuessLetter={addGuessLetter}
        />
      </div>
    </div>
  )
}

export default App