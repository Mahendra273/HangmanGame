import { useCallback, useEffect, useState } from 'react';
import jsonTesting from './TestingJson';
import HangmanDraw from './component/HangmanDraw';
import HangmanWord from './component/HangmanWord';
import Keyboard from './component/Keyboard';
import { Toaster, toast } from 'react-hot-toast';
interface WordData {
  wordCategorie: string;
  wordList: string[];
}

function App() {
 
const [ wordData, setwordData ] = useState<WordData>(jsonTesting());
  const {wordList,wordCategorie}=wordData

  const getRandomWord=()=>wordList[Math.floor(Math.random() * wordList.length)]
const [wordToGuess, setWordToGuess] = useState(getRandomWord());

  const [guessLetters, setGuessLetters] = useState<string[]>([]);

  // take and filter the letters we guess
  const incorrectLetters = guessLetters.filter(
    letter => !wordToGuess.includes(letter)
  )

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split('')
    .every(letter => guessLetters.includes(letter));

  const addGuessLetter = useCallback((letter: string) => {
    if (guessLetters.includes(letter) || isLoser || isWinner) {
      return
    } else {
      setGuessLetters(currentLetters => [...currentLetters, letter])
    }
  }, [guessLetters, isLoser, isWinner])

  function tryAgain(
 
  ) {
    setGuessLetters([]); // Reset the guessed letters
    setWordToGuess(getRandomWord()); // Reset the word to guess
  }

 
 
  useEffect(() => {
    // Expose the function to the global scope
    (window as any).handelWordData = handelWordData;
  }, []);

  function handelWordData(data: WordData) {
    setGuessLetters([]);
    setwordData(data);
  }
  // keyboard event handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) {
        return
      } else {
        e.preventDefault();
        addGuessLetter(key);
      }
    }

    document.addEventListener('keypress', handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessLetters]);

  useEffect(() => {
    if (isWinner) {
      toast('Congratulations, you won!', {
        icon: '👏',
        duration: 5000
      });
    }
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) {
      toast.error('You lost, please refresh the page!', {
        duration: 5000
      })
    }
  }, [isLoser, wordToGuess]);
const gameOver= isLoser || isWinner
  return (
    <div className='bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] bg-indigo-200 h-full'>
      <div className='font-adlam  lg:w-[80%] md:w-[90%]  flex items-center flex-col gap-4 mx-auto  p-2'>
        <Toaster />
       <h3 className='text-left self-start'> {wordCategorie}</h3>
        {/* I want to know how many times I chose the wrong letter */}
        <HangmanDraw numberOfGuess={incorrectLetters.length} />
        <HangmanWord
          result={isLoser}
          guessLetters={guessLetters}
          wordToGuess={wordToGuess}
        />
        <div className='self-stretch'>
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetter={guessLetters.filter(letter => wordToGuess.includes(letter))}
            inactiveLetter={incorrectLetters}
            addGuessLetter={addGuessLetter}
            tryAgain={tryAgain}
            gameOver={gameOver}
            
          />
        </div>
      </div>
    </div>
  )
}

export default App