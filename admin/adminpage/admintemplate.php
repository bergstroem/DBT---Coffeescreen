<!DOCTYPE html>

<html>
	<head>
		<title>admin</title>
		<link rel="stylesheet" type="text/css" href="admintemplate.css"/>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background">
			<div id="menubar">
				<div id="menuitem">Screens<a href="index.html"><span id="linkspan"></span></a></div>
				<div id="menuitem">Templates<a href="admintemplate.php"><span id="linkspan"></span></a></div>
				
			</div>
			<div id="content">
				<div id="templatelist">
					<?php include('listdir.php') ?>
				</div>
				<div id="bottombar">
					<div id="menuitem">New template<a href="templatehandle.php?mode=new&filename=''"><span id="linkspan"></span></a></div>
				</div>
			</div>
		</div>
	</body>
</html>