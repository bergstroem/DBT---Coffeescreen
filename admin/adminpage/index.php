﻿<!DOCTYPE html>

<html>
	<head>
		<title>Screens</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/dialog.js"></script>
		<script type="text/javascript" src="js/screen.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body onload="listScreens()">
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="screencontent" class="content">
				<table id="listContent">
					<tr class="listHeader">
						<td class="itemName">Name</td>
						<td class="itemType">Channel</td>
						<td><input type="button" id="panicAll" class="itemButton redbutton" value="Panic all"/></td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>	