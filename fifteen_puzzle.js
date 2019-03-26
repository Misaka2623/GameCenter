(function() {
  /**
   * @type {number} the size of the puzzle board.
   */
  const SIZE = 4;

  /**
   * An instance of this class refers a board of the 15 puzzle game.
   */
  class Board {
    /**
     * Constructs a Board object.
     */
    constructor() {
      this._value = new Array(SIZE ** 2);
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          this._value.push(new Square(x, y));
        }
      }
    }

    /**
     * Finds the square at the specified position.
     *
     * @param x {number} the x coordinate of the square.
     * @param y {number} the y coordinate of the square.
     * @returns {Square} the found square.
     */
    find(x, y) {
      return this._value[y * SIZE + x];
    }
  }

  /**
   * An instance of this class refers a square in the game board.
   */
  class Square {
    /**
     * Constructs a Square object.
     *
     * @param x {number} the x coordinate of this square.
     * @param y {number} the y coordinate of this square.
     */
    constructor(x, y) {
      this._x = x;
      this._y = y;

      this._value = document.createElement('div');
      this._value.id = `square_${x}_${y}`;
      this._value.className = 'square';

      if (!(x === SIZE - 1 && y === SIZE - 1)) {
        this._value.innerHTML = x + SIZE * y;

        const offsetX = x * -100;
        const offsetY = y * -100;
        this._value.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
      } else {
        this._value.style.border = 'none';
        this._value.style.height = '0';
      }

      document.getElementById('board').appendChild(this._value);
    }
  }

  window.addEventListener('load', main);

  function main() {
    const container = document.getElementById('board');
    container.style.width = `${SIZE * 100}px`;
    container.style.height = `${SIZE * 100}px`;
    const board = new Board();
  }
})();
