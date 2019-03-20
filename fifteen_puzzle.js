(function () {
  class Board {
    constructor() {
      this._value = new Array(SIZE ** 2);
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          this._value.push(new Square(x, y));
        }
      }
    }

    find(x, y) {
      return this._value[y * SIZE + x];
    }
  }

  class Square {
    constructor(x, y) {
      this._x = x;
      this._y = y;

      this._value = document.createElement("div");
      this._value.id = "square_" + x + "_" + "_y";
      this._value.className = "square";

      let offsetX = x * -100;
      let offsetY = y * -100;
      this._value.style.backgroundPosition = x + "px " + y + "px";
      this._value.style.width = "95px";

      document.getElementById("container").appendChild(this._value);
    }
  }

  let SIZE = 4;

  window.addEventListener("load", main);

  function main() {
    let container = document.getElementById("container");
    container.style.width = (SIZE - 1) * 100 + "px";
    container.style.height = (SIZE - 1) * 100 + "px";
    let board = new Board();
  }
})();
