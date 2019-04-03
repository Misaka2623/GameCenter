<!DOCTYPE html>
<html lang="en">

<meta charset="UTF-8">
<title>Fifteen Puzzle</title>
<link href="fifteen_puzzle.css" rel="stylesheet">
<script src="fifteen_puzzle.js"></script>

<div id="main">
  <div id="timer-container">
    <label for="timer" id="timer-label"></label>
    <input disabled id="timer" value="0:00:00"/>
  </div>
  <div id="board"></div>
  <div id="start-game-container">
    <button id="start-game">start game</button>
    <button disabled id="reset-game">reset game</button>
    <label for="select-stage">&nbsp;&nbsp; select stage:</label>
    <select id="select-stage">
      <option selected value="2">2</option>
    </select>
  </div>
</div>
<div id="side">
  <div id="score-pad">
    <p>score pad</p>
    <ol id="scores"></ol>
  </div>
</div>
