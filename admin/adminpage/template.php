<html>
	<head>
		<title>template</title>
		<link rel="stylesheet" type="text/css" href="admin.css"/>
		<script type="text/javascript" src="jquery-1.7.1.js"></script>
		<script type="text/javascript" src="json2.js"></script>
		<script type="text/javascript" src="drag.js"></script>
		<script type="text/javascript" src="template.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="content" class="content">
				<?php
					include("form.html");
					if($_GET['p'] == 2){
						$name = $_GET['name'];
						echo "<script>editTemplate(\"$name\")</script>";
					}
				?>
			</div>
		</div>
	</body>
</html>