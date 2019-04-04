<!DOCTYPE html>
<html lang="en">
<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: index.php');
}
?>

<meta charset="UTF-8">
<title>Fifteen Puzzle</title>
<link href="fifteen_puzzle.css" rel="stylesheet">
<script src="fifteen_puzzle.js"></script>

<div id="side1">
  <table id="score-pad">
    <tr>
      <th></th>
      <th>TOP 10</th>
    </tr>
  </table>
  <p id="ranking-page-link-text">
    <a href="" id="ranking-page-link">click</a> to ge to the ranking page</p>
</div>
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
      <option selected value="2">1</option>
    </select>
  </div>
</div>
<div id="side2">
  <table id="user-info">
    <tr>
      <th>username</th>
      <th>undefined</th>
    </tr>
    <tr>
      <td>signup date</td>
      <td>undefined</td>
    </tr>
    <tr>
      <td>last login</td>
      <td>undefined</td>
    </tr>
    <tr>
      <td>login count</td>
      <td>undefined</td>
    </tr>
    <tr>
      <td>games played</td>
      <td>undefined</td>
    </tr>
    <tr>
      <td>games won</td>
      <td>undefined</td>
    </tr>
    <tr>
      <td>highest level beaten</td>
      <td>undefined</td>
    </tr>
  </table>
</div>
<div id="logout-container">
  <button id="logout">logout</button>
</div>
