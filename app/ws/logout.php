<?php
	$usr = $_GET['usr'];
	if($usr)
	{
        $memcache = new Memcache;
		$memcache->connect('127.0.0.1', 11211) or die ("Could not connect to memcache server");
		$sessionphp = $memcache->delete($usr);
        //header("location: http://app.livepraktoreio.gr/index.php");
	}
?>