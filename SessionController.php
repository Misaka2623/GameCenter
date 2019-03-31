<?php
include "DataBaseManager.php";
echo "test if this fie loaded";
/*
$db_manager = new DataBaseManager();

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
*/

?>
