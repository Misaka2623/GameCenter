<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
include 'DatabaseManager.php';
session_start();
// when logged in
if(isset($_SESSION['user'])){
    // attempt to logout
    if(isset($_POST['Logout'])){
        unset($_POST['Logout']);
        session_destroy();
        header('Location: index.php');
    }
    else if(isset($_POST['user_info'])){
        $user_info = $db_manager->getUserInfo($_POST['user_info']);
        unset($_POST['user_info']);
        echo json_decode($user_info);
    }
    // add new game record
    else if(isset($_POST['new_record'])){
        $db_manager->newRecord($_SESSION['user'], $_POST['new_record']);
        unset($_POST['new_record']);
    }

    // add new score (time cost)
    else if(isset($_POST['new_score']) && isset($_POST['cur_level'])){
        $db_manager->newScore($_SESSION['user'], $_POST['cur_level'], $_POST['new_score']);
        unset($_POST['new_score']);
        $updated_score = $db_manager->getLevelScoreBoard($_POST['cur_level']);
        echo json_encode($updated_score);
    }
    // get level scoreboard
    else if(isset($_POST['level_scores'])){
        $scores = $db_manager->getLevelScoreBoard($_POST['level_scores']);
        echo json_encode($scores);
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
