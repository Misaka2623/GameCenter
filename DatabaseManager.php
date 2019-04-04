<?php
ini_set('display_error', 1);
error_reporting(E_ALL);

/*
Descrption: This class connect to the rds datebase and contains behaviors related to mysql.
Author: Hanwei Li
*/
class DatabaseManager{
    private $connection;
    public function __construct(){
        $host = 'csc346-project2.c3jmudlmcgqc.us-east-1.rds.amazonaws.com';
        $username = 'lihanwei4c';
        $password = 'gamecenterdbpassword';
        $database = 'GameInfo';
        $this->connection = new mysqli($host, $username, $password, $database);

        if(!$this->connection){
            die('Connection Failure: ' . $connection->connect_error);
        } 
    }
    public function login($username, $password){
        $sql_query = "SELECT hashed_password FROM user_info WHERE username = '$username'";
        $result = $this->connection->query($sql_query);
        if($result->num_rows > 0){
            // compare password
            $row = $result->fetch_assoc();
            if(password_verify($password, $row['hashed_password'])){
                $sql_query = "UPDATE user_info SET last_login = CURRENT_TIMESTAMP(), login_count = login_count + 1 WHERE username = '$username'";
                $this->connection->query($sql_query);
                return true;
            }
            return false;
        }
        // create new account if not exist already
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $sql_query = "INSERT INTO user_info (username, hashed_password, signup_date, last_login) VALUES ('$username', '$hashed_password', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())";
        $this->connection->query($sql_query);
        return true;
    }
    public function newRecord($username, $level){
        $sql_query = "UPDATE user_info SET games_played = games_played + 1 WHERE username = '$username'";
        $result = $this->connection->query($sql_query);
    }

    public function newScore($username, $level, $time_cost){
        // add game record
        $sql_query = "INSERT INTO game_records (player, game_level, play_date, time_cost) VALUES ('$username', '$level', NOW(), $time_cost)";
        $result = $this->connection->query($sql_query);

        // get the highest level beaten
        $sql_query = "SELECT MAX(game_level) AS game_level FROM game_records WHERE player = '$username'";
        $result = $this->connection->query($sql_query);
        $row = $result->fetch_assoc();
        $highest = $row['game_level'];

        // update games_won and the highest_level_beaten
        $sql_query = "UPDATE user_info SET games_won = games_won + 1, highest_level_beaten = $highest WHERE username = '$username'";
        $result = $this->connection->query($sql_query);
    }

    public function getUserInfo($username){
        $sql_query = "SELECT * FROM user_info WHERE username = '$username'";
        $result = $this->connection->query($sql_query);
        return $result->fetch_assoc();
    }
    
    public function getLevelScoreboard($level){
        $sql_query = "SELECT player, time_cost FROM game_records WHERE game_level = $level ORDER BY time_cost LIMIT 10";
        $result = $this->connection->query($sql_query);
        while($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
        return $rows;
    }

    public function getLeaderBoard(){
        $sql_query = "SELECT username, games_played, games_won, highest_level_beaten FROM user_info ORDER BY highest_level_beaten LIMIT 10";
        $result = $this->connection->query($sql_query);
        while($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
        return $rows;
    }
}
$db_manager = new DatabaseManager();
?>
