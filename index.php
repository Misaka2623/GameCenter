<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<title>Login</title>
<link href="index.css" rel="stylesheet">

<body>
<?php
session_start();
if (isset($_SESSION['user'])) {
    header('Location: fifteen_puzzle.php');
}
?>
<form action="SessionController.php" method="POST" align="center">
  <label for="username">username:</label>
  <input id="username" type="text" name="username" required><br>

  <label for="password">password:</label>
  <input id="password" type="password" name="password" required><br>

  <input type="submit" value="Login">
</form>
</body>
</html>
