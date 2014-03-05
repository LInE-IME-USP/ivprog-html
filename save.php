<?
	session_start();
	if(isset($_POST["src"])){
		$src = $_POST["src"];
		$id = time();
		$_SESSION["src_".$id] = $src;
		echo $id;
		exit;
	}

	echo "ERROR";