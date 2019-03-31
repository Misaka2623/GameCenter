<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include 'DatabaseManager.php';
echo "ha";
session_start();


if(isset($_POST['username']) && isset($_POST["password"])){
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $result = $db_manager->login($username, $password);
    if($result){
        $_SESSION['user'] = $_POST['username'];
        header('Location: fifteen_puzzle.html');
    }else{
        // show error
	echo "wrong password";
    }
}


?>
