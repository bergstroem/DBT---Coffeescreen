<!DOCTYPE html>

<html>
	<head>
		<title>admin</title>
		<link rel="stylesheet" type="text/css" href="admin.css"/>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="content" class="content">
				<?php
					include('template.php');
					handleTemplate($_GET['mode'], $_GET['filename']);
				?>
				</form>
			</div>
		</div>
	</body>
</html>