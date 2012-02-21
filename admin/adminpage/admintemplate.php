<html>
	<head>
		<title>Admintemplate</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/json2.js"></script>
		<script type="text/javascript" src="js/template.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="admintemplatecontent" class="content">
				<div id="templateheader" class="contentheader">
					Name:
					<input type="button" id="newButton" class="TInew" value="New Template"/>
				</div>
				<script>
					listTemplates();
				</script>
			</div>
		</div>
	</body>
</html>