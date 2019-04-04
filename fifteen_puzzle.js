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
   * @description the min stage number that the player can choose.
   * @type {number}
   */
  const kMinStage = 2;

  let aMaxStage;

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
        const header1 = document.createElement('th');
        header1.innerHTML = 'TOP 10';
        const header2 = document.createElement('th');
        header2.innerHTML = 'username';
        const header3 = document.createElement('th');
        header3.innerHTML = 'time cost';
        const row = document.createElement('tr');
        row.appendChild(header1);
        row.appendChild(header2);
        row.appendChild(header3);
        const score_table = document.getElementById('score-pad');
        score_table.innerHTML = '';
        score_table.appendChild(row);
        const scores = JSON.parse(request.responseText);
        let count = 1;
        for (const score of scores) {
          const num = document.createElement('td');
          num.innerHTML = (count++).toString();
          const username = document.createElement('td');
          username.innerHTML = score.player;
          const data = document.createElement('td');
          data.innerHTML = getTimeString(parseInt(score.time_cost));
          const line = document.createElement('tr');
          line.appendChild(num);
          line.appendChild(username);
          line.appendChild(data);
          score_table.appendChild(line);
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
     * @type {Map<number, HTMLDivElement>}
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

      const container = document.getElementById('board');
      container.style.height = `${Board._board_size}px`;
      container.style.width = `${Board._board_size}px`;

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
      Board.size = parseInt(document.getElementById('select-stage').value);
      this._ordinates.splice(0, this._ordinates.length);
      for (let ordinate = 1; ordinate <= Board._length; ordinate++) {
        this._ordinates.push(ordinate);
      }
      this._data.clear();

      for (const ordinate of this._ordinates) {
        const coordinate = Board.ordinate2coordinate(ordinate);
        const x = coordinate[0];
        const y = coordinate[1];

        const square = document.createElement('div');
        square.className = 'square';
        square.id = `square_${ordinate}`;

        square.style.borderWidth = `${Board._border_width}px`;
        square.style.fontSize = `${Board._square_font_size}pt`;
        square.style.height =
            `${Board._square_size - 2 * Board._border_width}px`;
        square.style.width =
            `${Board._square_size - 2 * Board._border_width}px`;
        square.style.lineHeight = square.style.height;
        square.innerHTML = ordinate.toString();

        if (ordinate === Board._length) {
          square.style.borderColor = '#d3d3d3';
          square.style.background = 'none';
          square.style.color = '#d3d3d3';
        } else {
          square.style.borderColor = '#000000';
          square.style.backgroundPosition = `${-1 * x * Board._square_size}px` +
              ` ${-1 * y * Board._square_size}px`;

          square.addEventListener('click',
              () => this._mouseClickedSquare(ordinate));
          square.addEventListener('mouseenter',
              () => this._mouseEnterSquare(ordinate));
          square.addEventListener('mouseleave',
              () => this._mouseLeaveSquare(ordinate));
        }

        this._data.set(ordinate, square);
      }
      showScore();
      refreshSelectableStage();
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
        const square = this._data.get(ordinate);
        square.style.cursor = 'pointer';
        square.style.borderColor = '#ff0000';
      }
    }

    /**
     * @description active when the mouse is leaved a square. change the border
     * color of the square back to black.
     * @param {number} ordinate the ordinate of the square.
     * @private
     */
    _mouseLeaveSquare(ordinate) {
      const square = this._data.get(ordinate);
      square.style.cursor = 'default';
      square.style.borderColor = '#000000';
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
      const container = document.getElementById('board');
      container.innerHTML = '';
      for (const ordinate of this._ordinates) {
        const square = this._data.get(ordinate);
        container.appendChild(square);
      }
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
      this.stopGame();
      // if (aMaxStage === Board.size) {
        aMaxStage++;
      // }
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
      document.getElementById('timer').value = '0:00:00.000';
      document.getElementById('start-game').disabled = false;
      document.getElementById('reset-game').disabled = true;
      document.getElementById('select-stage').disabled = false;
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
      document.getElementById('start-game').disabled = true;
      document.getElementById('reset-game').disabled = false;
      document.getElementById('select-stage').disabled = true;
      this._started = true;
    }
  }

  /**
   * @description renews the timer on the page.
   */
  function countTime() {
    const timer = document.getElementById('timer');
    timer.value = getTimeString(Date.now() - aStartTime);
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
    const select = document.getElementById('select-stage');
    select.innerHTML = '';
    for (let i = kMinStage; i <= aMaxStage; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.innerHTML = (i - 1).toString();
      select.appendChild(option);
      // if (i === Board.size + 1) {
      //   option.selected = true;
      // }
    }
  }

  window.addEventListener('load', () => {
    aMaxStage = 2;
    refreshSelectableStage();
    const board = new Board();
    document.getElementById('start-game').
        addEventListener('click', () => board.startGame());
    document.getElementById('reset-game').
        addEventListener('click', () => board.stopGame());

    const select = document.getElementById('select-stage');
    select.addEventListener('change', () => {
      board.resetGame();
    });
    showScore();
  });

  function showUser() {
    let request = new XMLHttpRequest();
    request.open('POST', 'SessionController.php', true);
    request.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    request.send('user_info=1');
    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        const user = JSON.parse(request.responseText);
        document.getElementById('username-data').innerHTML = user.username;
        document.getElementById(
            'signup-date-data').innerHTML = user.signup_date;
        document.getElementById('last-login-data').innerHTML = user.last_login;
        document.getElementById(
            'login-count-data').innerHTML = user.login_count;
        document.getElementById(
            'games-played-data').innerHTML = user.games_played;
        document.getElementById('games-won-data').innerHTML = user.games_won;
        document.getElementById(
            'highest-level-beaten-data').innerHTML = user.highest_level_beaten;
      }
    });
    console.log('haha');
  }
})();
