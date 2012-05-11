<!DOCTYPE html>

<html>
	<head>
		<title>Channel</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/drag.js"></script>
		<script type="text/javascript" src="js/channel.js"></script>
		<script type="text/javascript" src="js/jquery.watermark.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="channelcontent" class="content">
				<?php
					include("channelform.html");
					if($_GET['p'] == 2){
						$name = $_GET['name'];
						echo "<script>editChannel(\"$name\")</script>";
					}
					else{
						echo "<script>getFeeds();</script>";
					}
				?>
			</div>
		</div>
	</body>
</html>