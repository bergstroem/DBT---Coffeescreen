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
				<form name="templateform" action="" method="GET">
					<div id="namebox" class="namebox">
						Name:
						<input type="text" name="name" class="nameTXB"/>
						<input type="button" name="savetemplatebutton" value="Save template" class="savetemplatebutton" onclick="saveTemplate(this.form)">
					</div>
					<div id="notebox" class="notebox">
						Note:
						<textarea name="note" class="noteTXB"></textarea>
					</div>
				</form>
				<div id="maindrop" class="maindrop" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
				<div id="subdrop" class="subdrop" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
				<div id="contentlist" class="contentlist" ondrop="drop(event)" ondragover="allowDrop(event)">
					<input type="button" name="button" value="save" class="spawnbutton" onclick="createContTEST()">
					<div id="contentspawner" class="contentspawner">
						<form name="itemform" action="" method="GET">
							<input type="text" name="input" class="contentTXB"/>
							<input type="button" name="button" value="save" class="savebutton" onclick="createCont(this.form)">
						</form>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>