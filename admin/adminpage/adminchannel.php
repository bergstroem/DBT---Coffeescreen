<!DOCTYPE html>

<html>
	<head>
		<title>Adminchannel</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/channel.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body onload="listChannels()">
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="adminchannelcontent" class="content">
				<table id="listContent">
					<tr class="listHeader">
						<td class="itemName">Name</td>
						<td>Description</td>
						<td><input type="button" id="newChannelButton" class="itemButton cyanbutton" value="Add"/></td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>