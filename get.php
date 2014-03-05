<?
	session_start();
	$id = $_GET["id"];
	$src = $_SESSION["src_".$id];

	header('Content-Description: File Transfer');
	header('Content-Disposition: attachment; filename="ivprog_'.$id.'.ivp"');
	header('Content-Type: application/octet-stream');
	header('Content-Transfer-Encoding: binary');
	header('Content-Length: ' . strlen($src));
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Expires: 0');

	echo $src;

