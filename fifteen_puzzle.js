(function() {
  'use strict';

  /**
   * The number for stopping the timer.
   * @type {number}
   */
  let aNumber;

  /**
   * The beginning time of the game (in ms).
   * @type {number}
   */
  let aStartTime;

  /**
   * A storage for storing the scores.
   * @static
   */
  class ScorePad {
    /**
     * The max items that can be shown on the page.
     * @const
     * @type {number}
     * @private
     */
    static _max_remain = 10;

    /**
     * An array contains all scores.
     * @const
     * @type {number[]}
     * @private
     */
    static _scores = [];

    /**
     * Adds a score into the list.
     * @param {number} score the score which should be added into the list.
     */
    static addScores(score) {
      this._scores.push(score);
      this._scores.sort((a, b) => a - b);
      this.show();
    }

    /**
     * Shows the score pad depending on current scores.
     */
    static show() {
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
   * An instance of this class refers a puzzle game board.
   */
  class Board {
    /**
     * The width and height of the game board (in px).
     * @const
     * @type {number}
     * @private
     */
    static _board_size = 400;

    /**
     * The number of squares at each row and column on the game board.
     * @const
     * @type {number}
     * @private
     */
    static _size = 2;

    /**
     * The total number of squares on the puzzle board.
     * @const
     * @type {number}
     * @private
     */
    static _length = Math.pow(Board._size, 2);

    /**
     * The width and height of the square (in px) including borders.
     * @const
     * @type {number}
     * @private
     */
    static _square_size = Board._board_size / Board._size;

    /**
     * The width of the border of the square (in px).
     * @const
     * @type {number}
     * @private
     */
    static _border_width = Board._square_size * 0.05;

    /**
     * The size of the font in the square on the board (in pt).
     * @const
     * @type {number}
     * @private
     */
    static _square_font_size = Board._square_size * 0.4;

    /**
     * Translates the specified ordinate to coordinate.
     * @param {number} ordinate the ordinate which should be translated.
     * @returns {number[]} an array that contains two numbers. The first number
     * is x coordinate; the second number is y coordinate.
     */
    static ordinate2coordinate(ordinate) {
      const index = ordinate - 1;
      return [index % Board._size, Math.floor(index / Board._size)];
    }

    /**
     * Stores all html elements of squares on the game board.
     * @const
     * @type {Map<number, HTMLDivElement>}
     * @private
     */
    _data;

    /**
     * An array contains the order of the ordinal of squares on the game
     * board.
     * @const
     * @type {number[]}
     * @private
     */
    _ordinates;

    /**
     * Indicates whether this game is playing by the user.
     * @type {boolean}
     * @private
     */
    _started;

    /**
     * Constructs a Board.
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
     * Gets the ordinate of the square at specified position.
     * @param {number} index position that the square at.
     * @returns {number} the ordinate of the square.
     * @private
     */
    _index2ordinate(index) {
      return this._ordinates[index];
    }

    /**
     * Initializes all squares on the board.
     */
    _initializeSquares() {
      this._ordinates.splice(0, this._ordinates.length);
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
          square.style.borderColor = '#000 #fff #fff #000';
          square.style.background = 'none';
          square.style.color = '#fff';
        } else {
          square.style.borderColor = '#000';
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
              square.style.borderColor = 'red';

              const empty_square = this._data.get(Board._length);
              const empty_index = this._ordinate2index(Board._length);
              const square_index = this._ordinate2index(ordinate);
              if (empty_index === square_index - 1) {
                empty_square.style.borderRightColor = 'red';
              } else if (empty_index === square_index + 1) {
                empty_square.style.borderLeftColor = 'red';
              } else if (empty_index === square_index - Board._size) {
                empty_square.style.borderBottomColor = 'red';
              } else {
                empty_square.style.borderTopColor = 'red';
              }
            }
          });
          square.addEventListener('mouseleave', () => {
            square.style.cursor = 'default';
            square.style.borderColor = 'black';
            const empty_style = this._data.get(Board._length).style;
            empty_style.borderColor =
                empty_style.borderColor.replace('red', 'black');
          });
        }

        this._data.set(ordinate, square);
      }
    }

    /**
     * Indicates whether the specified square is available to move.
     * @param {number} ordinate the ordinate of the square.
     * @returns {boolean} true if the square is available to move.
     * @private
     */
    _isAvailableToMove(ordinate) {
      const index = this._ordinate2index(ordinate);
      const empty = this._ordinate2index(Board._length);
      return index >= 0 && index + Board._size === empty
          || index % Board._size !== 0 && index - 1 === empty
          || index < Board._length && index - Board._size === empty
          || index % Board._size !== Board._size - 1 && index + 1 === empty;
    }

    /**
     * Translates the specified ordinate to the index that the square at.
     *
     * @param {number} ordinate the ordinate of the square.
     * @returns {number} the index that the square at.
     * @private
     */
    _ordinate2index(ordinate) {
      return this._ordinates.indexOf(ordinate);
    }

    /**
     * Shows the game board depending on current set of squares.
     * @private
     */
    _show() {
      const container = document.getElementById('board');
      container.innerHTML = '';
      for (const ordinate of this._ordinates) {
        container.appendChild(this._data.get(ordinate));
      }

      const index = this._ordinate2index(Board._length);

      let colors = '';
      colors += index / Board._size < 1 ? 'white ' : 'black ';
      colors += index % Board._size === Board._size - 1 ? 'white ' : 'black ';
      colors += index / Board._size >= Board._size - 1 ? 'white ' : 'black ';
      colors += index % Board._size === 0 ? 'white' : 'black';

      this._data.get(Board._length).style.borderColor = colors;
    }

    /**
     * Shuffles the squares randomly.
     * @private
     */
    _shuffle() {
      for (let i = 0; i < 1000; i++) {
        const index = this._ordinate2index(Board._length);
        const directions = [];
        if (Math.floor(index / Board._size) !== 0) {
          directions.push(index - Board._size);
        }
        if (Math.floor(index / Board._size) !== Board._size - 1) {
          directions.push(index + Board._size);
        }
        if (index % Board._size !== 0) {
          directions.push(index - 1);
        }
        if (index % Board._size !== Board._size - 1) {
          directions.push(index + 1);
        }

        const random = Math.floor(Math.random() * directions.length);
        const target = directions[random];
        this._swap(target, index);
      }
      this._show();
    }

    /**
     * Swaps the two squares at specified position.
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
     * Ends the game.
     */
    endGame() {
      clearInterval(aNumber);
      const time = Date.now() - aStartTime;
      ScorePad.addScores(time);
      setTimeout(() => window.alert(
          `complete! used ${getTimeString(time)}`), 200);
      document.getElementById('timer').value = '0:00:00';
      document.getElementById('start-game').disabled = false;
      this._initializeSquares();
      this._show();
      this._started = false;
    }

    /**
     * Indicates whether the puzzle is solved.
     * @returns {boolean} true if the puzzle is solved.
     */
    isSolved() {
      return this._ordinates.filter(
          (value, index) => value !== index + 1).length === 0;
    }

    /**
     * Starts the game.
     */
    startGame() {
      aStartTime = Date.now();
      while (this.isSolved()) {
        this._shuffle();
      }
      aNumber = setInterval(countTime, 1000);
      document.getElementById('start-game').disabled = true;
      this._started = true;
    }

    // resetGame() {
    //
    // }
  }

  /**
   * Renews the timer on the page.
   */
  function countTime() {
    const timer = document.getElementById('timer');
    timer.value = getTimeString(Date.now() - aStartTime);
  }

  /**
   * Gets the string form of the time from game started to now.
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

  window.addEventListener('load', () => {
    const board = new Board();
    const button = document.getElementById('start-game');
    button.addEventListener('click', () => board.startGame());
    ScorePad.show();
  });
})();
