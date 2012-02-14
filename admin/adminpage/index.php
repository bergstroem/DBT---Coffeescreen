<html>
	<head>
		<title>admin</title>
		<link rel="stylesheet" type="text/css" href="admin.css"/>
		<script type="text/javascript" src="drag.js"></script>
		<script type="text/javascript" src="form.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="content" class="content">
				<div id="maindrop" class="maindrop" ondrop="drop(event)" ondragover="allowDrop(event)">
				</div>
				<div id="subdrop" class="subdrop" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
				<div id="contentlist" class="contentlist" ondrop="drop(event)" ondragover="allowDrop(event)">
					<div id="contentspawner" class="contentspawner">
						<form name="itemform" action="" method="GET">
							<input type="text" name="input" class="contentTXB"/>
							<INPUT type="button" name="button" value="save" class="savebutton" onClick="createCont(this.form)">
						</form>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>