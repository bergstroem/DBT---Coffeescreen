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
				<div id="feedheader" class="contentheader maincolor">
					Name:
					<input type="button" id="newFeedButton" class="newItemButton" value="New Feed"/>
				</div>
			</div>
		</div>
	</body>
</html>