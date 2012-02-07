<!DOCTYPE html>

<html>
	<head>
		<title>admin</title>
		<link rel="stylesheet" type="text/css" href="templatehandle.css"/>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background">
			<div id="menubar">
				<div id="menuitem">Screens<a href="index.html"><span id="linkspan"></span></a></div>
				<div id="menuitem">Templates<a href="admintemplate.php"><span id="linkspan"></span></a></div>
			</div>
			<div id="content">
				<?php
					include('template.php');
					handleTemplate($_GET['mode'], $_GET['filename']);
				?>
				</form>
			</div>
		</div>
	</body>
</html>