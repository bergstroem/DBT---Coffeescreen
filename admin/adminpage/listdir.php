<?php
	if($handle = opendir('.')){
		echo "<div class='templateheader'>Name:</div>";
		
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -4), ".txt")){
				$name = substr($entry, 0, -4);
				echo "<div class='templateitem' id='$name'>$name
						<div class='TIedit' id='$entry edit'><a href='templatehandle.php?mode=edit&filename=$entry'><span class='linkspan'></span></a>Edit</div>
						<div class='TIdelete' id='$entry delete'><a href='templatehandle.php?mode=delete&filename=$entry'><span class='linkspan'></span></a>Delete</div>
					</div>";
			}
		}
		closedir($handle);
	}
?>