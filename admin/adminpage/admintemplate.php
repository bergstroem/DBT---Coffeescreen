﻿<!DOCTYPE html>

<html>
	<head>
		<title>admin</title>
		<link rel="stylesheet" type="text/css" href="admin.css"/>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="content" class="content">
				<div id="templatelist" class="templatelist">
					<?php include('listdir.php') ?>
				</div>
				<div id="bottombar" class="bottombar">
					<div id="new template" class="menuitem">New template<a href="templatehandle.php?mode=new&filename=''"><span class="linkspan"></span></a></div>
				</div>
			</div>
		</div>
	</body>
</html>