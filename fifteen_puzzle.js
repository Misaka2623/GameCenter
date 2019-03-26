/*jshint esversion: 7 */

(function() {
  'use strict';

  // TODO: shuffle

  /**
   * The size of the puzzle board.
   *
   * @type {number}
   */
  const BOARD_SIZE = 4;

  /**
   * The size of the square in the board (in pixel).
   *
   * @type {number}
   */
  const SQUARE_SIZE = 100;

  /**
   * An instance of this class refers a board of the 15 puzzle game.
   */
  class Board {
    /**
     * Constructs a Board object.
     */
    constructor() {
      /**
       * An array contains the order of the squares on the board.
       *
       * @const
       * @type {number[]}
       * @private
       */
      this.orders_ = Array.from(new Array(BOARD_SIZE * BOARD_SIZE),
          (value, index) => index);

      /**
       * An array contains all the squares on the board.
       *
       * @const
       * @type {HTMLElement[]}
       * @private
       */
      this.data_ = [];

      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          this.addSquare(x, y);
        }
      }
    }

    addSquare(x, y) {
      const ordinal = x + y * BOARD_SIZE;

      const square = document.createElement('div');
      square.className = 'square';
      square.id = `square_${ordinal}`;
      square.addEventListener('click', () => {
        if (this.isAbleToMove(ordinal)) {
          this.swap(this.indexOf(ordinal),
              this.indexOf(this.orders_.length - 1));
        }
      });

      if (x === BOARD_SIZE - 1 && y === BOARD_SIZE - 1) {
        square.innerHTML = '　';
        square.style.borderColor = 'black white white black';
      } else {
        square.innerHTML = ordinal;
        square.style.backgroundPosition = `${x * -100}px ${y * -100}px`;

        square.addEventListener('mouseenter', () => {
          if (this.isAbleToMove(ordinal)) {
            square.style.cursor = 'pointer';
            square.style.borderColor = 'red';
          }
        });
        square.addEventListener('mouseout', () => {
          square.style.cursor = 'default';
          square.style.borderColor = 'black';
        });
      }

      document.getElementById('board').appendChild(square);

      this.data_.push(square);
    }

    /**
     * Gets the index of the specified square in this.orders_.
     *
     * @param order {number} the order of the square.
     * @returns {number} the found index.
     */
    indexOf(order) {
      for (let i = 0; i < this.orders_.length; i++) {
        if (this.orders_[i] === order) {
          return i;
        }
      }
    }

    /**
     * Indicates whether the specified square is near the empty square.
     *
     * @param order {number} the order of the square.
     * @returns {boolean} true if the specified square is able to move.
     */
    isAbleToMove(order) {
      const index1 = this.indexOf(order);
      const index2 = this.indexOf(this.orders_.length - 1);

      const x1 = index1 % BOARD_SIZE;
      const y1 = parseInt(index1 / BOARD_SIZE);
      const x2 = index2 % BOARD_SIZE;
      const y2 = parseInt(index2 / BOARD_SIZE);

      return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
    }

    /**
     * Swaps two squares at specified position.
     *
     * @param index1 {number} the index of the first square.
     * @param index2 {number} the index of the second square.
     */
    swap(index1, index2) {
      const item1 = this.orders_[index1];
      const item2 = this.orders_[index2];
      this.orders_.splice(index2, 1, item1);
      this.orders_.splice(index1, 1, item2);

      const container = document.getElementById('board');
      container.innerHTML = '';
      for (let order of this.orders_) {
        const square = this.data_[order];
        container.appendChild(square);
      }

      const index = this.indexOf(this.orders_.length - 1);

      let colors = '';
      colors += index / BOARD_SIZE < 1 ? 'white ' : 'black ';
      colors += index % BOARD_SIZE === BOARD_SIZE - 1 ? 'white ' : 'black ';
      colors += index / BOARD_SIZE >= BOARD_SIZE - 1 ? 'white ' : 'black ';
      colors += index % BOARD_SIZE === 0 ? 'white' : 'black';

      this.data_[this.orders_.length - 1].style.borderColor = colors;
    }
  }

  window.addEventListener('load', main);

  function main() {
    const container = document.getElementById('board');
    container.style.width = `${BOARD_SIZE * SQUARE_SIZE}px`;
    container.style.height = `${BOARD_SIZE * SQUARE_SIZE}px`;
    const board = new Board();
  }
})();
