<?php
/*
Descrption: This class connect to the rds datebase and contains behaviors related to mysql.
Author: Hanwei Li
*/
class DataBaseManager{
    private $connection;
    public function __construct(){
        $host = 'csc346-project2.c3jmudlmcgqc.us-east-1.rds.amazonaws.com';
        $username = 'lihanwei4c';
        $password = 'gamecenterdbpassword';
        $database = 'GameInfo';
        $connection = new mysqli($host, $username, $password, $database);

        if(!$connection->connection_error){
            die('Failed connecting to the DataBase');
        }

        
    }
    public function login($username, $password){
        $sql_query = "SELECT hashed_password FROM user_info WHERE username = '$username'");
        $result = $connection->query($connection, $sql_query);
        if($result->num_rows > 0){
            // compare password
            $row = $result->fetch_assoc();
            if(password_verify($password, $row[0])){
                $sql_query = "UPDATE user_info SET last_login = CURRENT_TIMESTAMP(), login_count = login_count + 1";
                return true;
            }
            return false;
        }
        // create new account if not exist already
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $sql_query = "INSERT INTO user_info (username, hashed_password, signup_date, last_login) VALUES ('$username', '$hashed_password', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())";
        return true;
    }
}
?>