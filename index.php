<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<title>Login</title>
<body>
    <form action="SeasonController.php" method="POST" align="center">
        <label for="username">username:</label>
        <input id="username" type="text" name="username"><br>

        <label for="password">password:</label>
        <input id="password" type="password" name="password"><br>

        <input type="submit" value="Login">
    </form>
</body>
</html>