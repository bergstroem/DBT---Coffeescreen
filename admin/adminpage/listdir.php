<?php
	if($handle = opendir('.')){
		echo "<p>Template files:</p>";
		
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -4), ".txt")){
				$name = substr($entry, 0, -4);
				echo "<div id='templateitem'>$name
						<div id='TIedit'><a href='templatehandle.php?mode=edit&filename=$entry'><span id='linkspan'></span></a>Edit</div>
						<div id='TIdelete'><a href='templatehandle.php?mode=delete&filename=$entry'><span id='linkspan'></span></a>Delete</div>
					</div>";
			}
		}
		closedir($handle);
	}
?>