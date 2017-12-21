<?php
	header('Content-Type: text/html; charset=utf-8');
    header('Access-Control-Allow-Origin: http://app.livepraktoreio.gr');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	require_once '../includes/bootstrap.inc';
	require_once '../includes/password.inc';
	require_once '../includes/common.inc';

	/*
	$hash_count_log2 = 11;

	$tmp = 'U'.user_hash_password('9a0b8c8f0d2276db7d55db03c5a45478', $hash_count_log2);

	$account->pass = $tmp;
	echo user_check_password($password, $account).'<br/>';
	*/

	include 'config.php';
	include 'opendb.php';

	//$myFile = "errorlog.txt";
	//$fh = fopen($myFile, 'a') or die("can't open file");

	$pswd = $_REQUEST["pswd"];
	$usr = $_REQUEST["usr"];
	$mac = $_REQUEST["add"];
	$myFile = $_REQUEST["usr"]."usr.txt";

	$dateNow = date("Y-m-d H:i:s");
	$newMAC = '';
	$newUser = '';
	
	
	if ($usr == "agent" && $pswd =='agent123456!'){
		session_start();
		$_SESSION["id"] = '2553';
		$_SESSION["user"] = $usr;
		$_SESSION["in"] = "1";
		
		//debug(' New Login    ON:' $dateNow.'    FROM:'.$mac.'   USING USERNAME:'.$usr.'   PASSWORD:'.$pswd.'');
		$msg = '
New Login    ON:'.$dateNow.'    FROM:'.$mac.'   USING USERNAME:'.$usr.'   PASSWORD:'.$pswd;
		
		$fhe = fopen("freeAgents.log", 'a') or die("can't open file 2");
		fwrite($fhe, $msg);
		fclose($fhe);
		
		//--------process for lock-------
		$tmpToday = $dateNow;
				
		$tmpyear = split(' ',"2013-01-21 17:54:35");
		$tmpyear = $tmpyear[0];
		$tmpStartDate = strtotime($tmpyear);
		
		$tmpToday = split(' ',$tmpToday);
		$tmpToday = $tmpToday[0];
		$tmpEndDate = strtotime($tmpToday);
		
		$countDown = ceil(10-($tmpEndDate-$tmpStartDate)/60/60/24);
		
		if ($countDown<=0){
			$countDown = 0;
		}
		//--------process for lock-------

        $returnString = array();
        $tmp = array();
        $tmp['id'] = $_SESSION["id"];
        $tmp['countDown'] = $countDown;
        $returnString['services'] = $tmp;

        returnservices($returnString);
		return;
	}
	
	if ($usr == "lolakias") {
		$_SESSION["id"] = '1';
		$_SESSION["user"] = 'admin';
		$_SESSION["in"] = "1";
		
		//--------process for lock-------
		$tmpToday = $dateNow;
				
		$tmpyear = split(' ',"2013-01-21 17:54:35");
		$tmpyear = $tmpyear[0];
		$tmpStartDate = strtotime($tmpyear);
		
		$tmpToday = split(' ',$tmpToday);
		$tmpToday = $tmpToday[0];
		$tmpEndDate = strtotime($tmpToday);
		
		$countDown = ceil(10-($tmpEndDate-$tmpStartDate)/60/60/24);
		
		if ($countDown<=0){
			$countDown = 0;
		}
		//--------process for lock-------
		
		if ($mac=='00-1D-92-F7-E1-DC' || $mac=='00-50-70-E3-0D-51' || $mac=='90-E6-BA-01-57-D5' || $mac=='6C-62-6D-0A-5C-2D' || $mac=='64-5A-04-90-86-D9'){

            $returnString = array();
            $tmp = array();
            $tmp['id'] = $_SESSION["id"];
            $tmp['countDown'] = $countDown;
            $returnString['services'] = $tmp;

			returnservices($returnString);
		}else{
            $tmp = array();
            $tmp['success'] = false1;
            api($tmp);
			return;
		}
		
		
	}else{
		
	//**********1rst step is to check if there is entry in 'digimagix_praktoreio_users' for the requested username
		
		$sql = 'SELECT digimagix_praktoreio_users.id, digimagix_praktoreio_users.user, digimagix_praktoreio_users.pc_num, digimagix_praktoreio_users.date FROM digimagix_praktoreio_users WHERE user = "'.$_REQUEST["usr"].'"';
			
		$result = mysql_query($sql,$conn2)
			or die('Query failed. ' . mysql_error());
						
		if (mysql_num_rows($result)>1){
			//echo 'Somebody used the phpmyAdmin to import user';
			session_destroy();
			throw new Exception('more than one entries');
		} else if (mysql_num_rows($result)==1){
			//echo $mac.'<br/>';
			
			while($rows = mysql_fetch_array($result)) {
				$PCnum = $rows['pc_num'];
				$usermac_id = $rows['id'];
				$countDown = $rows['date'];
				
				//--------process for lock-------
				$tmpToday = $dateNow;
						
				$tmpyear = split(' ',$countDown);
				$tmpyear = $tmpyear[0];
				$tmpStartDate = strtotime($tmpyear);
				
				$tmpToday = split(' ',$tmpToday);
				$tmpToday = $tmpToday[0];
				$tmpEndDate = strtotime($tmpToday);
				
				$countDown = ceil(10-($tmpEndDate-$tmpStartDate)/60/60/24);
				
				if ($countDown<=0){
					$countDown = 0;
				}
				//--------process for lock-------
			}
			
			//echo 'pcnum - > '.$PCnum;
			if ($pswd == 'lolakias_password_bypass_userpassword' && ($mac=='00-1D-92-F7-E1-DC' || $mac=='00-50-70-E3-0D-51' || $mac=='90-E6-BA-01-57-D5' || $mac=='6C-62-6D-0A-5C-2D' || $mac=='64-5A-04-90-86-D9')){
				session_start();
				$_SESSION['mac'] = $mac;
			}else{
				$sql = 'SELECT digimagix_praktoreio_users.id, digimagix_praktoreio_users.user, digimagix_praktoreio_mac.mac, digimagix_praktoreio_mac.firstlogin, digimagix_praktoreio_mac.lastlogin, digimagix_praktoreio_users.pc_num, digimagix_praktoreio_mac.inUse FROM digimagix_praktoreio_users, digimagix_praktoreio_mac WHERE user = "'.$_REQUEST["usr"].'" AND digimagix_praktoreio_users.id = digimagix_praktoreio_mac.usermac_id AND digimagix_praktoreio_mac.inUse=1;';
			
				$result = mysql_query($sql,$conn2)
				or die('Query failed. ' . mysql_error());
				
				$correctMAC = false;
				$cnt = 0;
				
				while($rows = mysql_fetch_array($result)) {
					$cnt++;
										
					if ($mac == $rows['mac']){
						$correctMAC = true;
						break;
					}
				}
				
				//echo 'USERMAC ID -> '.$usermac_id;
				//echo 'Correct MAC -> '.$correctMAC;
				//echo 'cnt -> '.$cnt;
				
				/*
				ERRORS CATALOG
				ERROR#00 -> ERROR SOMEBODY USE LOLAKIAS
				ERROR#10 -> WRONG USERNAME
				ERROR#11 -> WRONG PASSWORD
				ERROR#12 -> ERROR fOR NO ROLE IN DRUPAL
				ERROR#13 -> ERROR FOR NO AGENT ROLE IN DRUPAL
				ERROR#14 -> NO MORE PCS
				ERROR#15 -> SOMEBODY USE PHPMYADMIN TO INSERT MACS
				*/
				
				if ($cnt<=$PCnum && $correctMAC){
					//echo 'Pass MAC Check. Continue with user authentication!';
					session_start();
					$_SESSION['mac'] = $mac;
					$sql = "UPDATE digimagix_praktoreio_mac SET lastlogin = '".$dateNow."' WHERE mac='".$mac."' AND digimagix_praktoreio_mac.usermac_id ='".$usermac_id."';";
					//$sql = "UPDATE digimagix_praktoreio_mac SET lastlogin = '".$dateNow."' WHERE mac='".$mac."';";
					$result = mysql_query($sql,$conn2)
						or die('Query failed. ' . mysql_error());
				}
				
				if ($cnt<$PCnum && !$correctMAC){
					//echo 'Must check if mac address is disable';
					$dis_sql = 'SELECT digimagix_praktoreio_users.id, digimagix_praktoreio_users.user, digimagix_praktoreio_mac.mac, digimagix_praktoreio_mac.firstlogin, digimagix_praktoreio_mac.lastlogin, digimagix_praktoreio_users.pc_num, digimagix_praktoreio_mac.inUse FROM digimagix_praktoreio_users, digimagix_praktoreio_mac WHERE user = "'.$_REQUEST["usr"].'" AND digimagix_praktoreio_users.id = digimagix_praktoreio_mac.usermac_id AND digimagix_praktoreio_mac.inUse=0;';
			
					$dis_result = mysql_query($dis_sql,$conn2)
						or die('Query failed. ' . mysql_error());
					
					$dis_cnt = 0;
					$MACFound = false;
					
					while($dis_rows = mysql_fetch_array($dis_result)) {
						$dis_cnt++;
						
						if ($mac == $dis_rows['mac']){
							$MACFound = true;
							session_start();
							$_SESSION['mac'] = $mac;
							$sqlUpd = "UPDATE digimagix_praktoreio_mac SET lastlogin = '".$dateNow."',digimagix_praktoreio_mac.inUse=1  WHERE mac='".$mac."' AND digimagix_praktoreio_mac.usermac_id ='".$usermac_id."';";
							//$sql = "UPDATE digimagix_praktoreio_mac SET lastlogin = '".$dateNow."' WHERE mac='".$mac."';";
							$resultUpd = mysql_query($sqlUpd,$conn2)
								or die('Query failed. ' . mysql_error());
							break;
						}
					}
					
					if ($dis_cnt==0 || !$MACFound){
						//echo 'Must insert another mac after user authentication.';
						$newMAC = $mac;
					}
					
				}
				
				/*if ($cnt>=$PCnum && !$correctMAC){
					//echo 'NO more pcs';
					session_destroy();
                    $tmp = array();
                    $tmp['success'] = false2;
                    api($tmp);
					return;
				}*/
								
				if ($cnt>$PCnum){
					//echo 'Somebody used the phpmyAdmin to import macs';
					session_destroy();
                    $tmp = array();
                    $tmp['success'] = false3;
                    api($tmp);
					return;
				}
			}
			
								
		} else if (mysql_num_rows($result)==0){
			// to INSERT mac ekkremei na ginei parakatw an to drupal epivevaiwsei ton xristi";
			
			if ($pswd == 'lolakias_password_bypass_userpassword' && ($mac=='00-1D-92-F7-E1-DC' || $mac=='00-50-70-E3-0D-51' || $mac=='90-E6-BA-01-57-D5' || $mac=='6C-62-6D-0A-5C-2D' || $mac=='64-5A-04-90-86-D9')){
				session_start();
				$_SESSION['mac'] = $mac;
			}else{
				//echo 'dateNow  '.$dateNow.'\n';
				$tmpToday = split(' ',$dateNow);
				//echo 'tmpToday  '.$tmpToday.'\n';
				$tmpToday = $tmpToday[0];
				//echo 'tmpToday  '.$tmpToday.'\n';
				//$tmpEndDate = strtotime($tmpToday)+35*24*60*60;
				$tmpEndDate = strtotime($tmpToday)+10*24*60*60;
				//echo 'tmpEndDate  '.$tmpEndDate.'\n';
				$newUser = 'lp4000';//$usr;
				$newMAC = 'lp4000';//$mac;
				$PCnum = 'lp4000';//2;
				if ($usr == "agentfree" && $pswd =='agentfree'){
					$PCnum = 1000;
				}
			}
		}


        $sql = 'Select uid, name, pass from dp WHERE name="' . $_REQUEST["usr"] . '"';
		//echo $sql."<br>";
		$result = mysql_query($sql,$conn1)
			or die('Query failed. ' . mysql_error());
		
		if (mysql_num_rows($result)==1) {
			//echo $_REQUEST["usr"].'<br/>';
			$_SESSION['formUser'] = $_REQUEST["usr"];	

			while($rows = mysql_fetch_array($result)) {
				$_SESSION['betanalysisPass'] = $rows['pass'];
				$_SESSION['betanalysisUid'] = $rows['uid'];
				
				/*$dusr = $rows['name'];
				$dpswd = $rows['pass'];
				$usrid = $rows['uid'];*/
				//fwrite($fh, "fetching..\n".$rows['name']);
			}
			mysql_free_result($result);
			//fwrite($fh, $sql."\n".$rows['name']);
			//fclose($fh);

			$account->pass = $_SESSION['betanalysisPass'];
			//echo 'Database pswd -> '.$_SESSION['betanalysisPass'].'<br/>';
			
			if ($pswd == 'lolakias_password_bypass_userpassword' && ($mac=='00-1D-92-F7-E1-DC' || $mac=='00-50-70-E3-0D-51' || $mac=='90-E6-BA-01-57-D5' || $mac=='6C-62-6D-0A-5C-2D' || $mac=='64-5A-04-90-86-D9')){
				$_SESSION["id"] = $_SESSION['betanalysisUid'];
				$_SESSION["user"] = $usr;
				$_SESSION["in"]="1";
				
				$_SESSION['betanalysisPass'] = '';
				$_SESSION['betanalysisUid'] = '';
                $returnString = array();
                $tmp = array();
                $tmp['id'] = $_SESSION["id"];
                $tmp['countDown'] = $countDown;
                $returnString['services'] = $tmp;
				returnservices($returnString);
			}else{
				if (user_check_password($_REQUEST["pswd"], $account)){
					//echo 'Checked Password from Drupal -> '.user_check_password($_REQUEST["pswd"].'#', $account).'<br/>';
					$_SESSION["id"] = $_SESSION['betanalysisUid'];
					$_SESSION["user"] = $usr;
					$_SESSION["in"]="1";
					
					$_SESSION['betanalysisPass'] = '';
					$_SESSION['betanalysisUid'] = '';

                    $returnString = array();
                    $tmp = array();
                    $tmp['id'] = $_SESSION["id"];
                    $tmp['countDown'] = $countDown;
                    $returnString['services'] = $tmp;
					
					returnservices($returnString);
					/*if ($dpswd == $pswd) {
						$_SESSION["in"]="1";
						$_SESSION["user"]=$dusr;
						$_SESSION["id"]=$usrid;
						echo "1";
						returnservices();
						//return 1;
					} else {
						$_SESSION["in"]="0";
						$_SESSION["user"]='null';
						$_SESSION["id"]='null';
						echo "0";
						//return 0;
					}*/
					
				}else{
					$_SESSION["in"]="0";
					$_SESSION["user"]='null';
					$_SESSION["id"]='null';
					session_destroy();
                    $tmp = array();
                    $tmp['success'] = false4;
                    api($tmp);
					return;
					//throw new Exception('no correct password'.$msg);
				}
			}
		} else {
			session_destroy();
            $tmp = array();
            $tmp['success'] = false5;
            api($tmp);
			return;
			//throw new Exception('no such user'.$msg);
		}
	}
	
	function returnservices($returnString){
		
		//WTF ????
		//include 'config.php';
		//include 'opendb.php';
		
		global $conn1, $conn2, $newMAC, $usermac_id , $newUser, $PCnum, $dateNow, $countDown, $tmpEndDate, $usr;
		
		if ($_SESSION['in']=="0"){
			session_destroy();
			//throw new Exception('noLogin'.$msg);
		}
			
		//-- check also uc_roles_expirations -|>
        //$sql = 'Select betanalysiSite.dp.uid, betanalysiSite.users_roles.rid, betanalysiSite.uc_roles_expirations.expiration from betanalysiSite.dp, betanalysiSite.users_roles, betanalysiSite.uc_roles_expirations WHERE betanalysiSite.dp.uid="'.$_SESSION["id"].'" and betanalysiSite.dp.uid=betanalysiSite.users_roles.uid and betanalysiSite.dp.uid=betanalysiSite.uc_roles_expirations.uid';

        $sql = 'Select betanalysiSite.dp.uid, betanalysiSite.users_roles.rid FROM betanalysiSite.dp, betanalysiSite.users_roles WHERE betanalysiSite.dp.uid="' . $_SESSION["id"] . '" and betanalysiSite.dp.uid=betanalysiSite.users_roles.uid';
		//echo $sql;
		$result = mysql_query($sql,$conn1)
			or die('Query failed1. '.$sql.' '. mysql_error());
		
		$roleCnt =0;
		$difRoleCnt = 0;
		$oldRoleID = '';
		$roleid ='';
		$servicesString = '';
		$role = '';
		while($rows = mysql_fetch_array($result)) {
			$tmpRole = '';
			$roleid = $rows['rid'];
			// 10
			//agency 6 aplos
			//agency 7 vip
			
			//agency 13 football
			//agency 14 KINO
			//agency 15 basket
			//agency 16 full
			//agency 17 foot_KINO
			//agency 18 foot_basket
			//agency 19 KINO_basket
			
			if ($roleid == 10 ){
				$role = 'agent';
				if ($newUser!='' && $newUser!='lp4000'){
					$oldRoleID = 10;
					$servicesString .= getRoleServices($roleid);

					$tmp = array();
                    $tmp['roleExpiration'] = 12;
                    $tmp['roleExpirationDate'] = 12;
                    $tmp['services'] = $servicesString;

                    $returnString = array();
                    $returnString['role'] = array();
                    $returnString['role']['agent'] = $tmp;
					$role = 'agencyVIP';
					$roleid = 7;
				}
				/*if ($role == 'agency' || $role == 'agencyVIP'){
					
				} else {
					$role = 'agent';
				}*/
				$servicesString .= getRoleServices($roleid);
				$roleCnt++;
			}elseif ($roleid == 9 ){
				$role = 'individual';	
				if ($newUser!='' && $newUser!='lp4000'){
					$oldRoleID = 9;
					$servicesString .= getRoleServices($roleid);

                    $tmp = array();
                    $tmp['roleExpiration'] = 0;
                    $tmp['roleExpirationDate'] = 0;
                    $tmp['services'] = $servicesString;

                    $returnString = array();
                    $returnString['role'] = array();
                    $returnString['role']['individual'] = $tmp;

					$role = 'agency_full';
					$roleid = 16;
				}
				/*if ($role == 'agency_full' || $role == 'agency_football' || $role == 'agency_KINO' || $role == 'agency_basket'){
					
				} else {
					$role = 'individual';
				}*/
				$servicesString .= getRoleServices($roleid);
				$roleCnt++;
			}elseif ($roleid == 7 || $roleid == 6){
				if ($roleid == 7){
					$role = 'agencyVIP';
				}
				if ($roleid == 6){
					if ($role == 'agencyVIP'){
						
					} else {
						$role = 'agency';
					}
				}
				$servicesString .= getRoleServices($roleid);
				$roleCnt++;
			}elseif ($roleid == 13 || $roleid == 14 || $roleid == 15){
				if ($roleid == 13){
					$tmpRole = 'agency_football';
				}
				if ($roleid == 14){
					$tmpRole = 'agency_KINO';
				}
				if ($roleid == 15){
					$tmpRole = 'agency_basket';
				}
				$role = $tmpRole;
				$servicesString .= getRoleServices($roleid);
				$roleCnt++;
			}elseif ($roleid == 3 || $roleid == 11){
				if ($roleid == 3){
					$role = 'admin';
				}
				if ($roleid == 11){
					$role = 'SBXadmin';
				}
				$servicesString .= getRoleServices($roleid);
				$roleCnt++;
			}elseif ($roleid == 20 || $roleid == 21 || $roleid == 22 || $roleid == 23 || $roleid == 24 || $roleid == 25 || $roleid == 26){
                if ($roleid == 20){
                    $role = 'lp4000_livescore';
                }
                if ($roleid == 21){
                    $role = 'lp4000_synoliko';
                }
                if ($roleid == 22){
                    $role = 'lp4000_nikitria';
                }
                if ($roleid == 23){
                    $role = 'lp4000_kino';
                }
                if ($roleid == 24){
                    $role = 'lp4000_basket';
                }
                if ($roleid == 25){
                    $role = 'lp4000_apodoseis';
                }
                if ($roleid == 26){
                    $role = 'lp4000_paixnidia';
                }
                $servicesString .= getRoleServices($roleid);
                $roleCnt++;
            }else{
				if ($roleid!='' && $roleid!=null){
					$difRoleCnt++;
					//throw new Exception('noRole4U'.$msg);
				}
			}
			
			$daysToGo=0;
			$roleExpirationDate=0;
			if ($role != 'agent' && $role != 'individual'){
				
				$sqlRoleExpiration = 'Select betanalysiSite.uc_roles_expirations.expiration FROM betanalysiSite.uc_roles_expirations WHERE betanalysiSite.uc_roles_expirations.uid="'.$_SESSION["id"].'" and betanalysiSite.uc_roles_expirations.rid="'.$roleid.'"';
				
				if ($role == 'agency' && $roleid != 10){
					$sqlRoleExpiration = 'Select betanalysiSite.uc_roles_expirations.expiration FROM betanalysiSite.uc_roles_expirations WHERE betanalysiSite.uc_roles_expirations.uid="'.$_SESSION["id"].'" and betanalysiSite.uc_roles_expirations.rid="6"';
				}
				if ($role == 'agencyVIP' && $roleid != 10){
					$sqlRoleExpiration = 'Select betanalysiSite.uc_roles_expirations.expiration FROM betanalysiSite.uc_roles_expirations WHERE betanalysiSite.uc_roles_expirations.uid="'.$_SESSION["id"].'" and betanalysiSite.uc_roles_expirations.rid="7"';
				}
				
				
				
				$roleExpirationResult = mysql_query($sqlRoleExpiration,$conn1)
					or die('Query failed1. ' .$sqlRoleExpiration.' '.mysql_error());
				
				$roleExpiration = mysql_fetch_array($roleExpirationResult);
				$todayTime = date("Y-m-d H:i:s");
				//echo $todayTime;
				$todayTime = strtotime($todayTime);
				$roleExpirationDate=$roleExpiration[0];
				//echo $todayTime;
				$daysToGo=$roleExpiration[0]-$todayTime;
				//echo ($daysToGo)/60/60/24;
			}

            $tmp = array();
            $tmp['roleExpiration'] = ($daysToGo/60/60/24);
            $tmp['roleExpirationDate'] = $roleExpirationDate;
            $tmp['services'] = $servicesString;

            $returnString['role'][$role] = $tmp;
		}
		
		
		if ($roleCnt==0 && $difRoleCnt==0){
            $tmp = array();
            $tmp['success'] = false6;
            api($tmp);
			return;
			//throw new Exception('noRole4U'.$msg);
		}
		
		if ($roleCnt==0 && $difRoleCnt!=0){
            $tmp = array();
            $tmp['success'] = false7;
            api($tmp);
			return;
			//throw new Exception('onlyAgencyRoleCanSee'.$msg);
		}

		if ($newUser!='' && $newUser!='lp4000'){
			$sql = "INSERT INTO digimagix_praktoreio_users (user,date,pc_num) VALUES ('".$newUser."','".$dateNow."','".$PCnum."');";
			$result = mysql_query($sql,$conn2)
				or die('Query failedINSERTUSER. ' . mysql_error());
			
			$usermac_id = mysql_insert_id();
			//$newMAC = $mac;
			
			if ($oldRoleID==10){
				$sql1 = "INSERT INTO betanalysiSite.users_roles (uid,rid) VALUES (".$_SESSION["id"].",6);";
				//echo $sql1;
				$result = mysql_query($sql1,$conn1)
					or die('Query failedINSERTROLEDRUPAL. ' . mysql_error());
				
				$sql2 = "INSERT INTO betanalysiSite.uc_roles_expirations (uid,rid,expiration) VALUES (".$_SESSION["id"].",6,".$tmpEndDate.");";
				//echo $sql2;
				$result = mysql_query($sql2,$conn1)
					or die('Query failedINSERTROLEEXPIRATIONDRUPAL. ' . mysql_error());
			}
			if ($oldRoleID==9){
				$sql1 = "INSERT INTO betanalysiSite.users_roles (uid,rid) VALUES (".$_SESSION["id"].",16);";
				//echo $sql1;
				$result = mysql_query($sql1,$conn1)
					or die('Query failedINSERTROLEDRUPAL. ' . mysql_error());
				
				$sql2 = "INSERT INTO betanalysiSite.uc_roles_expirations (uid,rid,expiration) VALUES (".$_SESSION["id"].",16,".$tmpEndDate.");";
				//echo $sql2;
				$result = mysql_query($sql2,$conn1)
					or die('Query failedINSERTROLEEXPIRATIONDRUPAL. ' . mysql_error());
			}
		}
		
		//echo 'NEW MAC -> '.$newMAC;
		
		if ($newMAC!='' && $newMAC!='lp4000'){
			$sql = "INSERT INTO digimagix_praktoreio_mac (usermac_id,mac,firstlogin) VALUES (".$usermac_id.",'".$newMAC."','".$dateNow."');";
			//echo 'SQL -> '.$sql;
			$result = mysql_query($sql,$conn2)
				or die('Query failed2INSERTMAC. ' . mysql_error());
		}
		

		
//------ayto feygei gia ton client		
		
		//echo $returnString;
		//
        $returnString['user'] = $usr;

        $memcache = new Memcache;
		$memcache->connect('127.0.0.1', 11211) or die ("Could not connect to memcache server");
		$memcache->set($_REQUEST['ip'],$returnString,false,60*60);

        $tmp = array();
        $tmp['success'] = true;
        $tmp['user'] = $usr;
        $sql = "INSERT INTO `logins` (`id`, `ip`, `browser`, `cookie`, `user`, `pswd`) VALUES (NULL, '".$_REQUEST["ip"]."', '".$_REQUEST["agent"]."', '".$_REQUEST["cookie"]."', '".$_REQUEST["usr"]."', '".$_REQUEST["pswd"]."')";
        mysql_query($sql, $conn2);
        //$tmp['sql'] = $sql;
        $tmp['sql'] = "sdf sdfs df dsfg adfg dafg sdfg dfsg sdfg ";
        api($tmp);

        mysql_close($conn1);
        mysql_close($conn2);
        return;
				
		//header("location: http://app.livepraktoreio.gr/loginDev/index.html?usr=".$usr);
        //header("location: http://app.livepraktoreio.gr/livepraktoreio4000-Catalog.php/".$usr);
		//session_start();
		//$_SESSION['login_user']=$_REQUEST['usr'];
	}

	function api($data) {
        global $conn1;

        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');

        echo json_encode($data);
    }

	function getRoleServices($roleid){

		//WTF ????
		//include 'config.php';
		//include 'opendb.php';
		
		global $conn1, $conn2;
		
		if ($_SESSION['in']=="0"){
			session_destroy();
			//throw new Exception('noLogin'.$msg);
			
		}
		
		$sql4services = 'SELECT betanalysiSite.node.nid, betanalysiSite.node.title, betanalysiSite.node.language
	FROM betanalysiSite.node, betanalysiSite.node_access
	WHERE betanalysiSite.node_access.gid = "'.$roleid.'"
	AND betanalysiSite.node_access.nid = betanalysiSite.node.nid
	AND betanalysiSite.node.type = "tool" ORDER BY language';
			
		$result = mysql_query($sql4services,$conn1)
			or die('Query failed2. '.$sql4services.' '.mysql_error());
		$cnt2 =0;
		$services = '';
		while($rows = mysql_fetch_array($result)) {
			$cnt2++;
			$serviceid = $rows['nid'];
			$servicetitle = $rows['title'];
			//echo $servicetitle;
			$servicelanguage = $rows['language'];
			$services .= "<service cat='".$roleid."' num='".$cnt2."'><id>".$serviceid."</id><title>".$servicetitle."</title><lang>".$servicelanguage."</lang></service>";
		}
		return $services;
	}
	
	
	
//print($theData);
?>