(function() {
  'use strict';

  /**
   * @description the number for stopping the timer.
   * @type {number}
   */
  let aNumber;

  /**
   * @description the beginning time of the game (in ms).
   * @type {number}
   */
  let aStartTime;

  /**
   * @description the max stage number that the player can choose.
   * @type {number}
   */
  let aMaxStage;

  /**
   * @description the min stage number that the player can choose.
   * @type {number}
   */
  const kMinStage = 2;

  /**
   * @description adds a score into the list.
   * @param {number} score the score which should be added into the list.
   */
  function addScores(score) {
    const request = new XMLHttpRequest();
    request.open('POST', 'SessionController.php', true);
    request.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    request.send(`new_score=${score}&cur_level=${Board.size - 1}`);
  }

  /**
   * @description shows the score pad depending on current scores.
   */
  function showScore() {
    const request = new XMLHttpRequest();
    request.open('POST', 'SessionController.php', true);
    request.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    request.send(`level_scores=${Board.size - 1}`);
    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        const row = $('<tr></tr>');
        row.append('<th>TOP 10</th>')
            .append('<th>username</th>')
            .append('<th>time cost</th>');
        const table = $('#score-pad').empty().append(row);
        /** @namespace score.player */
        /** @namespace score.time_cost */
        const scores = JSON.parse(request.responseText);
        let count = 1;
        for (const score of scores) {
          table.append(
              $('<tr></tr>')
                  .append(`<td>${count++}</td>`)
                  .append(`<td>${score.player}</td>`)
                  .append(
                      `<td>${getTimeString(parseInt(score.time_cost))}</td>`),
          );
        }
      }
    });
  }

  /**
   * @description an instance of this class refers a puzzle game board.
   */
  class Board {
    /**
     * @description the width and height of the game board (in px).
     * @const
     * @type {number}
     * @private
     */
    static _board_size = 400;

    /**
     * @description the number of squares at each row and column on the game
     * board.
     * @type {number}
     */
    static size = 2;

    /**
     * @description gets the width of the border of the square (in px).
     * @returns {number} the width of the border of the square (in px).
     * @private
     */
    static get _border_width() {
      return this._square_size * .05;
    }

    /**
     * @description gets the total number of squares on the puzzle board.
     * @returns {number} the total number of squares on the puzzle board.
     * @private
     */
    static get _length() {
      return Math.pow(this.size, 2);
    }

    /**
     * @description gets the size of the font in the square on the board (in
     * pt).
     * @returns {number} the size of the font in the square on the board (in
     * pt).
     * @private
     */
    static get _square_font_size() {
      return this._square_size * .4;
    }

    /**
     * @description gets the width and height of the square (in px) including
     * borders.
     * @returns {number} the width and height of the square (in px) including
     * borders.
     * @private
     */
    static get _square_size() {
      return this._board_size / this.size;
    }

    /**
     * @description translates the specified ordinate to coordinate.
     * @param {number} ordinate the ordinate which should be translated.
     * @returns {number[]} an array that contains two numbers. The first number
     * is x coordinate; the second number is y coordinate.
     */
    static ordinate2coordinate(ordinate) {
      const index = ordinate - 1;
      return [index % Board.size, Math.floor(index / Board.size)];
    }

    /**
     * @description stores all html elements of squares on the game board.
     * @const
     * @type {Map<number, jQuery>}
     * @private
     */
    _data;

    /**
     * @description an array contains the order of the ordinal of squares on the
     * game board.
     * @const
     * @type {number[]}
     * @private
     */
    _ordinates;

    /**
     * @description indicates whether this game is playing by the user.
     * @type {boolean}
     * @private
     */
    _started;

    /**
     * @description constructs a Board.
     */
    constructor() {
      this._data = new Map();
      this._ordinates = [];
      this._started = false;

      $('#board').css({
        'height': `${Board._board_size}px`,
        'width': `${Board._board_size}px`,
      });

      this._initializeSquares();
      this._show();
    }

    /**
     * @description gets the ordinate of the square at specified position.
     * @param {number} index position that the square at.
     * @returns {number} the ordinate of the square.
     * @private
     */
    _index2ordinate(index) {
      return this._ordinates[index];
    }

    /**
     * @description initializes all squares on the board.
     */
    _initializeSquares() {
      showUser();
      Board.size = parseInt($('#select-stage').val());
      this._ordinates.splice(0, this._ordinates.length);
      for (let ordinate = 1; ordinate <= Board._length; ordinate++) {
        this._ordinates.push(ordinate);
      }
      this._data.clear();

      for (const ordinate of this._ordinates) {
        const coordinate = Board.ordinate2coordinate(ordinate);
        const x = coordinate[0];
        const y = coordinate[1];

        const square = $('<div></div>');
        square
            .addClass('square')
            .attr('id', `square_${ordinate}`)
            .text(ordinate)
            .css({
              'border-width': `${Board._border_width}px`,
              'font-size': `${Board._square_font_size}pt`,
              'height': `${Board._square_size - 2 * Board._border_width}px`,
              'line-height':
                  `${Board._square_size - 2 * Board._border_width}px`,
              'width': `${Board._square_size - 2 * Board._border_width}px`,
            });

        if (ordinate === Board._length) {
          square.css({
            'border-color': '#e0e0e0',
            'background': 'none',
            'color': '#e0e0e0',
          });
        } else {
          square
              .css({
                'border-color': '#000000',
                'background-position': `${-1 * x * Board._square_size}px ` +
                    `${-1 * y * Board._square_size}px`,
              })
              .click(() => this._mouseClickedSquare(ordinate))
              .hover(() => this._mouseEnterSquare(ordinate),
                  () => this._mouseLeaveSquare(ordinate));
        }

        this._data.set(ordinate, square);
      }
    }

    /**
     * @description indicates whether the specified square is available to move.
     * @param {number} ordinate the ordinate of the square.
     * @returns {boolean} true if the square is available to move.
     * @private
     */
    _isAvailableToMove(ordinate) {
      const index = this._ordinate2index(ordinate);
      const empty = this._ordinate2index(Board._length);
      return index >= 0 && index + Board.size === empty
          || index % Board.size !== 0 && index - 1 === empty
          || index < Board._length && index - Board.size === empty
          || index % Board.size !== Board.size - 1 && index + 1 === empty;
    }

    /**
     * @description active when a square is clicked. swap the clicked square
     * and the empty square if the clicked square is able to swap.
     * @param {number} ordinate the ordinate of the clicked square.
     * @private
     */
    _mouseClickedSquare(ordinate) {
      if (this._started && this._isAvailableToMove(ordinate)) {
        this._swap(this._ordinate2index(ordinate),
            this._ordinate2index(Board._length));
        this._show();
        if (this.isSolved()) {
          this.endGame();
        }
      }
    }

    /**
     * @description active when the mouse is entered a square. change the border
     * color of the square to be red if the clicked square is able to swap.
     * @param {number} ordinate the ordinate of the square.
     * @private
     */
    _mouseEnterSquare(ordinate) {
      if (this._started && this._isAvailableToMove(ordinate)) {
        this._data.get(ordinate)
            .css({'cursor': 'pointer', 'border-color': '#ff0000'});
      }
    }

    /**
     * @description active when the mouse is leaved a square. change the border
     * color of the square back to black.
     * @param {number} ordinate the ordinate of the square.
     * @private
     */
    _mouseLeaveSquare(ordinate) {
      this._data.get(ordinate)
          .css({'cursor': 'default', 'border-color': '#000000'});
    }

    /**
     * @description translates the specified ordinate to the index that the
     * square at.
     * @param {number} ordinate the ordinate of the square.
     * @returns {number} the index that the square at.
     * @private
     */
    _ordinate2index(ordinate) {
      return this._ordinates.indexOf(ordinate);
    }

    /**
     * @description shows the game board depending on current set of squares.
     * @private
     */
    _show() {
      const container = $('#board').empty();
      for (const ordinate of this._ordinates) {
        const square = this._data.get(ordinate);
        container.append(square);
      }
      showScore();
    }

    /**
     * @description shuffles the squares randomly.
     * @private
     */
    _shuffle() {
      for (let i = 0; i < 1000; i++) {
        const available = [];
        for (const ordinate of this._ordinates) {
          if (this._isAvailableToMove(ordinate)) {
            available.push(ordinate);
          }
        }
        const random = Math.floor(Math.random() * available.length);
        this._swap(this._ordinate2index(available[random]),
            this._ordinate2index(Board._length));
      }
      this._show();
    }

    /**
     * @description swaps the two squares at specified position.
     * @param {number} index1 the index of one square.
     * @param {number} index2 the index of another square.
     * @private
     */
    _swap(index1, index2) {
      const item1 = this._index2ordinate(index1);
      const item2 = this._index2ordinate(index2);
      this._ordinates.splice(index2, 1, item1);
      this._ordinates.splice(index1, 1, item2);
    }

    /**
     * @description ends the game.
     */
    endGame() {
      const time = Date.now() - aStartTime;
      setTimeout(() => window.alert(
          `complete! used ${getTimeString(time)}`), 100);
      addScores(time);
      if (Board.size === aMaxStage) {
        aMaxStage++;
      }
      refreshSelectableStage();
      this.stopGame();
    }

    /**
     * @description indicates whether the puzzle is solved.
     * @returns {boolean} true if the puzzle is solved.
     */
    isSolved() {
      return this._ordinates.filter(
          (value, index) => value !== index + 1).length === 0;
    }

    /**
     * @description resets the game.
     */
    resetGame() {
      this._initializeSquares();
      this._show();
    }

    /**
     * @description stops the game.
     */
    stopGame() {
      clearInterval(aNumber);
      $('#timer').val('0:00:00.000');
      $('#start-game').attr('disabled', false);
      $('#reset-game').attr('disabled', true);
      $('#select-stage').attr('disabled', false);
      this._started = false;
      this._initializeSquares();
      this._show();
    }

    /**
     * @description starts the game.
     */
    startGame() {
      this._initializeSquares();

      let request = new XMLHttpRequest();
      request.open('POST', 'SessionController.php', true);
      request.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded');
      request.send(`new_record=${Board.size - 1}`);

      aStartTime = Date.now();
      while (this.isSolved()) {
        this._shuffle();
      }
      aNumber = setInterval(countTime, 1);
      $('#start-game').attr('disabled', true);
      $('#reset-game').attr('disabled', false);
      $('#select-stage').attr('disabled', true);
      this._started = true;
    }
  }

  /**
   * @description renews the timer on the page.
   */
  function countTime() {
    $('#timer').val(getTimeString(Date.now() - aStartTime));
  }

  /**
   * @description gets the string form of the time from game started to now.
   * @returns {string} the string form of the time.
   */
  function getTimeString(time) {
    const millisecond = time % 1000;
    time = Math.floor(time / 1000);
    const second = time % 60;
    const minute = Math.floor(time / 60) % 60;
    const hour = Math.floor(time / 3600);
    return `${hour}` +
        `:${minute < 10 ? 0 : ''}${minute}` +
        `:${second < 10 ? 0 : ''}${second}` +
        `.${millisecond < 100 ? 0 : ''}${millisecond < 10 ? 0 : ''}` +
        `${millisecond}`;
  }

  /**
   * @description refreshes the select stage label to match the change of the
   * max stage.
   */
  function refreshSelectableStage() {
    const select = $('#select-stage').empty();
    for (let i = kMinStage; i <= aMaxStage; i++) {
      const option = $('<option></option>').val(i).text(i - 1);
      select.append(option);
      if (i === aMaxStage) {
        option.attr('selected', true);
      }
    }
  }

  $(main);

  function main() {
    aMaxStage = 2;
    refreshSelectableStage();

    const board = new Board();
    $('#start-game').click(() => board.startGame());
    $('#reset-game').click(() => board.stopGame());
    $('#select-stage').change(() => board.resetGame());

    showScore();
  }

  function showUser() {
    let request = new XMLHttpRequest();
    request.open('POST', 'SessionController.php', true);
    request.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    request.send('user_info=1');
    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        /** @namespace user.signup_date */
        /** @namespace user.last_login */
        /** @namespace user.login_count */
        /** @namespace user.games_played */
        /** @namespace user.games_won */
        /** @namespace user.highest_level_beaten */
        const user = JSON.parse(request.responseText);
        $('#username-data').text(user.username);
        $('#signup-date-data').text(user.signup_date);
        $('#last-login-data').text(user.last_login);
        $('#login-count-data').text(user.login_count);
        $('#games-played-data').text(user.games_played);
        $('#games-won-data').text(user.games_won);
        $('#highest-level-beaten-data').text(user.highest_level_beaten);
      }
    });
  }
})();
