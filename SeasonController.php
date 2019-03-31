<?php
include 'DataBaseManager.php';

$db_manager = new DataBaseManager();

session_start();


if(isset($_POST['username']) && isset($_POST["password"])){
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $result = $db_manager->login($username, $password);
    if($result){
        $_SESSION['user'] = $_POST['username'];
    }else{
        // show error
    }
}


?>