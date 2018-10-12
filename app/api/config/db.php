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
    //TODO : Ayto einai to config gia ton server Germany.
    private $dbhost = 'localhost';
    private $dbuser = 'lpadmin';
    private $dbpass = 'OKEcmRv1UAa0Fqrb';
    private $dbname = 'clrbooking';

//    //TODO : Ayto einai to config gia ton local server.
//    private $dbhost = 'localhost';
//    private $dbuser = 'root';
//    private $dbpass = '';
//    private $dbname = 'clrbooking';

    //TODO : Ayto einai to config gia ton PANTEIOS server.
//    private $dbhost = 'localhost';
//    private $dbuser = 'rbookings';
//    private $dbpass = '7nwqp0gtbutEAi1';
//    private $dbname = 'rbookings';


    // Connect
    public function connect()
    {
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }
}