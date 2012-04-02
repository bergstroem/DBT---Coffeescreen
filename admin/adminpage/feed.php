<html>
	<head>
		<title>Feeds</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/feed.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body onload="getFeedTypes()">
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="feedcontent" class="content">
				<?php
					include("feedform.html");
					if($_GET['p'] == 2){
						$name = $_GET['name'];
						echo "<script>editChannel(\"$name\")</script>";
					}
				?>
			</div>
		</div>
	</body>
</html>