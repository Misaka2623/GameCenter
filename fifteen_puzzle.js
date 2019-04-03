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
   * @description a map stores all stage map to the user high scores.
   * @type {Map<number, ScorePad>}
   * @see ScorePad
   */
  const kScores = new Map();

  class User {
    _username;

    _password;

    _scores;

    _lastLogin;
  }

  /**
   * @description a storage for storing the scores.
   */
  class ScorePad {
    /**
     * @description the max items that can be shown on the page.
     * @const
     * @type {number}
     * @private
     */
    _max_remain = 10;

    /**
     * @description an array contains all scores.
     * @const
     * @type {number[]}
     * @private
     */
    _scores = [];

    /**
     * @description adds a score into the list.
     * @param {number} score the score which should be added into the list.
     */
    addScores(score) {
      this._scores.push(score);
      this._scores.sort((a, b) => a - b);
      let request = new XMLHttpRequest();
      request.open("POST", "SessionController.php", true);
      request.send("gamerecord=" + document.getElementById);
      this.show();
    }

    /**
     * @description shows the score pad depending on current scores.
     */
    show() {
      const score_list = document.getElementById('scores');
      score_list.innerHTML = '';
      for (let i = 0; i < this._max_remain; i++) {
        const list_item = document.createElement('li');
        const score = this._scores[i];
        if (isNaN(score)) {
          list_item.innerHTML = '';
        } else {
          list_item.innerHTML = getTimeString(score);
        }
        score_list.appendChild(list_item);
      }
    }
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
      Board.size = parseInt(document.getElementById('select-stage').value + 1);

      let request = new XMLHttpRequest();
      request.open("POST", "SessionController.php", true);
      request.send("cur_level=" + Board.size - 1);
      

      this._ordinates.splice(0, this._ordinates.length);
      this._data.clear();
      for (let ordinate = 1; ordinate <= Board._length; ordinate++) {
        this._ordinates.push(ordinate);
      }

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
          square.style.borderColor = '#000000 #d3d3d3 #d3d3d3 #000000';
          square.style.background = 'none';
          square.style.color = '#d3d3d3';
        } else {
          square.style.borderColor = '#000000';
          square.style.backgroundPosition = `${-1 * x * Board._square_size}px` +
              ` ${-1 * y * Board._square_size}px`;

          square.addEventListener('click', () => {
            if (this._started && this._isAvailableToMove(ordinate)) {
              this._swap(this._ordinate2index(ordinate),
                  this._ordinate2index(Board._length));
              this._show();
              if (this.isSolved()) {
                this.endGame();
              }
            }
          });
          square.addEventListener('mouseenter', () => {
            if (this._started && this._isAvailableToMove(ordinate)) {
              square.style.cursor = 'pointer';
              square.style.borderColor = '#ff0000';

              const empty_square = this._data.get(Board._length);
              const empty_index = this._ordinate2index(Board._length);
              const square_index = this._ordinate2index(ordinate);
              if (empty_index === square_index - 1) {
                empty_square.style.borderRightColor = '#ff0000';
              } else if (empty_index === square_index + 1) {
                empty_square.style.borderLeftColor = '#ff0000';
              } else if (empty_index === square_index - Board.size) {
                empty_square.style.borderBottomColor = '#ff0000';
              } else {
                empty_square.style.borderTopColor = '#ff0000';
              }
            }
          });
          square.addEventListener('mouseleave', () => {
            square.style.cursor = 'default';
            square.style.borderColor = '#000000';
            const empty_style = this._data.get(Board._length).style;
            empty_style.borderColor =
                empty_style.borderColor.replace('#ff0000', '#000000');
          });
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

      const index = this._ordinate2index(Board._length);

      let colors = '';
      colors += index / Board.size < 1 ? '#d3d3d3 ' : '#000000 ';
      colors += index % Board.size === Board.size - 1 ? '#d3d3d3 ' : '#000000 ';
      colors += index / Board.size >= Board.size - 1 ? '#d3d3d3 ' : '#000000 ';
      colors += index % Board.size === 0 ? '#d3d3d3' : '#000000';

      this._data.get(Board._length).style.borderColor = colors;
      if (!kScores.has(Board.size)) {
        kScores.set(Board.size, new ScorePad());
      }
      kScores.get(Board.size).show();
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
      clearInterval(aNumber);
      const time = Date.now() - aStartTime;
      if (!kScores.has(Board.size)) {
        kScores.set(Board.size, new ScorePad());
      }
      kScores.get(Board.size).addScores(time);
      setTimeout(() => window.alert(
          `complete! used ${getTimeString(time)}`), 200);
      document.getElementById('timer').value = '0:00:00';
      document.getElementById('start-game').disabled = false;
      document.getElementById('reset-game').disabled = true;
      this._started = false;
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
      clearInterval(aNumber);
      this.startGame();
    }

    /**
     * @description starts the game.
     */
    startGame() {
      this._initializeSquares();
      aStartTime = Date.now();
      while (this.isSolved()) {
        this._shuffle();
      }
      aNumber = setInterval(countTime, 1000);
      document.getElementById('start-game').disabled = true;
      document.getElementById('reset-game').disabled = false;
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
    time = Math.floor(time / 1000);
    const second = time % 60;
    const minute = Math.floor(time / 60) % 60;
    const hour = Math.floor(time / 3600);
    return `${hour}` +
        `:${minute < 10 ? 0 : ''}${minute}` +
        `:${second < 10 ? 0 : ''}${second}`;
  }

  function refreshSelectableStage() {
    const select = document.getElementById('select-stage');
<<<<<<< HEAD
=======
    //select.addEventListener('change',
    //     () => Board.size = parseInt(select.value));
>>>>>>> origin/master
    for (let i = kMinStage + 1; i <= aMaxStage; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.innerHTML = i.toString();
      select.appendChild(option);
    }
  }

  window.addEventListener('load', () => {
    aMaxStage = 10;
    refreshSelectableStage();

    const board = new Board();
    document.getElementById('start-game').
        addEventListener('click', () => board.startGame());
    document.getElementById('reset-game').
        addEventListener('click', () => board.resetGame());

    kScores.get(Board.size).show();
  });
})();
