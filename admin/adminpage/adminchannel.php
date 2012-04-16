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
				<div id="channelheader" class="listHeader maincolor">Name:<input type="button" id="newChannelButton" class="itemButton" value="New Channel"/>
				</div>
			</div>
		</div>
	</body>
</html>