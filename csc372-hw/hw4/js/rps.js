/**
 * Name: Benjamin Woods
 * Date: 03.01.2025
 * CSC 372-01
 *
 * Description:
 * JavaScript logic for a Rock-Paper-Scissors game. Handles:
 * 1) Player's selection (click on an image),
 * 2) Computer's 'thinking' for 3 seconds (shuffling images),
 * 3) Determining the winner,
 * 4) Updating the scoreboard and outcome.
 */

document.addEventListener('DOMContentLoaded', () => {
    // References to elements
    const playerThrows = document.querySelectorAll('.player-throw');
    const computerFigure = document.getElementById('computer-figure');
    const computerCaption = document.getElementById('computer-caption');
    const outcomeMessage = document.getElementById('outcome-message');
    const resetButton = document.getElementById('reset-button');
  
    const scoreWins = document.getElementById('score-wins');
    const scoreLosses = document.getElementById('score-losses');
    const scoreTies = document.getElementById('score-ties');
  
    // Score counters
    let wins = 0;
    let losses = 0;
    let ties = 0;
  
    // Possible moves
    const moves = ['rock', 'paper', 'scissors'];
  
    // Computer images
    const imageMap = {
      rock: 'images/rock.png',
      paper: 'images/paper.png',
      scissors: 'images/scissors.png',
      question: 'images/question.png',
    };
  
    // State
    let playerChoice = null;
    let isComputing = false; // to prevent multiple clicks while computer is thinking
  
    // Utility: Decide winner
    /**
     * Determines the winner of RPS
     * @param {string} player - 'rock','paper','scissors'
     * @param {string} comp - 'rock','paper','scissors'
     * @return {string} 'win','lose','tie'
     */
    function determineWinner(player, comp) {
      if (player === comp) {
        return 'tie';
      }
      if (
        (player === 'rock' && comp === 'scissors') ||
        (player === 'paper' && comp === 'rock') ||
        (player === 'scissors' && comp === 'paper')
      ) {
        return 'win';
      }
      return 'lose';
    }
  
    // Utility: Shuffle images for the computer's thinking
    function shuffleImages() {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      computerFigure.querySelector('img').src = imageMap[randomMove];
      computerCaption.textContent = '?';
    }
  
    // Handle player's selection
    playerThrows.forEach((throwEl) => {
      throwEl.addEventListener('click', () => {
        if (isComputing) return; // ignore clicks while computing
  
        // Remove previous selection highlights
        playerThrows.forEach((el) => el.classList.remove('selected'));
  
        // Highlight this selection
        throwEl.classList.add('selected');
        playerChoice = throwEl.getAttribute('data-move');
        outcomeMessage.textContent = 'You chose ' + playerChoice + '...';
  
        // Start computer's turn
        isComputing = true;
        computerFigure.querySelector('img').src = imageMap['question'];
        computerCaption.textContent = '???';
  
        // Shuffle images every 500ms for 3 seconds (6 times total)
        let count = 0;
        const shuffleInterval = setInterval(() => {
          shuffleImages();
          count++;
          if (count === 6) {
            clearInterval(shuffleInterval);
            // Now pick final random computer throw
            const compChoice = moves[Math.floor(Math.random() * moves.length)];
            computerFigure.querySelector('img').src = imageMap[compChoice];
            computerCaption.textContent = compChoice.toUpperCase();
  
            // Determine winner
            const result = determineWinner(playerChoice, compChoice);
            if (result === 'tie') {
              ties++;
              outcomeMessage.textContent = 'It\'s a tie!';
            } else if (result === 'win') {
              wins++;
              outcomeMessage.textContent = 'You win!';
            } else {
              losses++;
              outcomeMessage.textContent = 'Computer wins!';
            }
  
            // Update scoreboard
            scoreWins.textContent = wins;
            scoreLosses.textContent = losses;
            scoreTies.textContent = ties;
  
            // Unlock next move
            isComputing = false;
          }
        }, 500);
      });
    });
  
    // Reset button
    resetButton.addEventListener('click', () => {
      // Reset scoreboard
      wins = 0;
      losses = 0;
      ties = 0;
      scoreWins.textContent = '0';
      scoreLosses.textContent = '0';
      scoreTies.textContent = '0';
  
      // Clear selection
      playerThrows.forEach((el) => el.classList.remove('selected'));
      playerChoice = null;
  
      // Reset computer display
      computerFigure.querySelector('img').src = imageMap['question'];
      computerCaption.textContent = '???';
  
      // Reset outcome text
      outcomeMessage.textContent = 'No winner yet.';
    });
  });