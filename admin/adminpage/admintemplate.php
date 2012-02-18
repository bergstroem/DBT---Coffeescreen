<!DOCTYPE html>

<html>
	<head>
		<title>admintemplate</title>
		<link rel="stylesheet" type="text/css" href="../css/admin.css"/>
		<script type="text/javascript" src="jquery-1.7.1.js"></script>
		<script type="text/javascript" src="template.js"></script>
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
					<div id="new template" class="menuitem">New template<a href="template.php?p=1"><span class="linkspan"></span></a></div>
				</div>
			</div>
		</div>
	</body>
</html>