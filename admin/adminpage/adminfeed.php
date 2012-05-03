<!DOCTYPE html>

<html>
	<head>
		<title>Feeds</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/feed.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body onload="listFeeds()">
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="feedcontent" class="content">
				<table id="listContent">
					<tr class="listHeader">
						<td class="itemName">Name</td>
						<td class="itemType">Type</td>
						<td>Description</td>
						<td><input type="button" id="newFeedButton" class="itemButton maincolor" value="Add"/></td>
					</tr>
				</table>
			</div>
		</div>
	</body>
</html>