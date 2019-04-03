<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include 'DatabaseManager.php';
session_start();
// when logged in
if(isset($_SESSION['user'])){
    // attempt to logout
    if(isset($_POST['logout'])){
        session_destroy();
        header('Location: index.php');
    }

    // get level scoreboard
    if(isset($_POST['level_scores'])){
        $scores = $db_manager->getLevelScoreBoard();
        echo json_encode($scores);
    }


    // add new game record
    if(isset($_POST['new_record']) && isset($_GET['cur_level'])){
        $db_manager->newRecord($_SESSION['user'], $_GET['cur_level']);
        unset($_POST['new_record']);
    }

    // add new score (time cost)
    if(isset($_POST['new_score']) && isset($_POST['cur_level'])){
        $db_manager->newScore($_SESSION['user'], $_GET['cur_level'], $_POST['new_score']);
        unset($_POST['new_score']);
    }
}
// attempt to login
else if(isset($_POST['username']) && isset($_POST["password"])){
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $result = $db_manager->login($username, $password);
    if($result){
        $_SESSION['user'] = $_POST['username'];
        header('Location: fifteen_puzzle.php');
    }else{
        // show error
	    echo "wrong password";
    }
}

?>
