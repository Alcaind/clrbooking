<?php

/**
 * Created by PhpStorm.
 * User: alcaind
 * Date: 25/08/2017
 * Time: 5:57 μμ
 */
class db
{
    // Properties
    private $dbhost = 'localhost';
    private $dbuser = 'lpadmin';
    private $dbpass = 'OKEcmRv1UAa0Fqrb';
    private $dbname = 'lpadmin';

    // Connect
    public function connect()
    {
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }
}