import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField'

const RETURN_KEY_CODE = 13;

class HangmanDrawing extends React.Component {
    render() {
        const totalAllowedGuesses = 7;
        const guessesStr = "You have made " + this.props.Guesses + " wrong guesses.";
        const guessesRemaining = "You have " + (totalAllowedGuesses - this.props.Guesses) + " guesses remaining.";

        return (
            <div>{guessesStr}</div>
        );
    };
}

class Letters extends React.Component {
    render() {
        const word = this.props.Word;
        let hiddenWord = "";
        let formattedGuessedLetters = "";

        for (let i = 0; i < word.length; i++) {

            if (this.props.GuessedLetters.includes(word[i])) {
                hiddenWord += word[i];
            }
            else {
                hiddenWord += "-";
            }
        }

        for(let j = 0; j < this.props.GuessedLetters.length; j++) {

            if (j == this.props.GuessedLetters.length - 1) {
                formattedGuessedLetters += this.props.GuessedLetters[j];
            }
            else {
                 formattedGuessedLetters += this.props.GuessedLetters[j] + ",";
            }
        }

        return (
            <div>
                <div>{hiddenWord}</div>
                <div>{formattedGuessedLetters}</div>
            </div>
        );
    };
}

var GameStateEnum = {
    GAME_BEGIN_STAGE : 0,
    GAME_GUESS_STAGE : 1,
    GAME_END_STAGE : 2
}

class Game extends React.Component {

    constructor()
    {
        super();
        this.state = {
            GameState: GameStateEnum.GAME_BEGIN_STAGE,
            Word: '',
            Guesses: 0,
            GuessedLetters: new Array(),
        };
    }

    getChildContext( ) {
        return {
        muiTheme: getMuiTheme()
        };
    }
    
    onKeyDown(event)
    {
        if (event.keyCode == RETURN_KEY_CODE)
        {
            let text = event.target.value.trim();

            switch (this.state.GameState)
            {
                case GameStateEnum.GAME_BEGIN_STAGE:
                this.handleBeginGameInput(text);
                break;
                case GameStateEnum.GAME_GUESS_STAGE:
                this.handleGuessInput(text);
                break;
                case GameStateEnum.GAME_END_STAGE:
                this.handleGameOver();
                break;
            }
        }
    }

    handleBeginGameInput(text) {
        if (text == '') {
            return;
        }
        else {
            this.setState({Word: text, GameState: GameStateEnum.GAME_GUESS_STAGE});
        }
    }

    handleGuessInput(text) {
        if (text == '' || text.length != 1) {
            return;
        }
        else {
            let guesses = this.state.Guesses;
            let guessedLetters = this.state.GuessedLetters;
            guessedLetters.push(text);

            if (!this.state.Word.includes(text))
            {
                guesses++;
            }

            let wordIsCorrect = isWordCorrect(this.state.Word, guessedLetters);

            if (guesses == 7 || wordIsCorrect) {
                this.setState({Guesses: guesses, guessedLetters, GameState: GameStateEnum.GAME_END_STAGE});
            } else {
                this.setState({Guesses: guesses, guessedLetters});
            }
        }
    }

    handleGameOver() {
        this.setState({Word: "", Guesses: 0, GuessedLetters: new Array(), GameState: GameStateEnum.GAME_BEGIN_STAGE});
    }

    render() {
        switch (this.state.GameState)
        {
            case GameStateEnum.GAME_BEGIN_STAGE:

                return (
                    <div>
                        <p>Enter a word for the opponent to guess</p>
                        <TextField hintText="New word" onKeyDown={(e) => this.onKeyDown(e)} />
                    </div>
                );
                break;
            case GameStateEnum.GAME_GUESS_STAGE:
              return (
                    <div>
                        <HangmanDrawing Guesses={this.state.Guesses}/>
                        <Letters Word={this.state.Word} GuessedLetters={this.state.GuessedLetters}/>
                        <TextField hintText="Your guess?" onKeyDown={(e) => this.onKeyDown(e)} />
                    </div>
                );
                break;   
            case GameStateEnum.GAME_END_STAGE:

                let gameOverText = "";
                if (isWordCorrect(this.state.Word, this.state.GuessedLetters)) {
                    gameOverText = "You won!"
                } else {
                    gameOverText = "Sorry, you lost!"
                }

                return (
                        <div>
                            {gameOverText}
                        </div>
                    );
                break;
        }
    }
}


Game.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

function isWordCorrect(word, guessedLetters) {
    var wordIsCorrect = true;
    for (let i = 0; i < word.length; i++) {
        if (!guessedLetters.includes(word[i])) {
            wordIsCorrect = false;
            break;
        } 
    }

    return wordIsCorrect;
}

ReactDOM.render(<Game />, document.getElementById('root'));