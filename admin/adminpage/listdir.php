<?php
	if($handle = opendir('.')){
		echo "<div class='templateheader'>Name:</div>";
		
		while(false !== ($entry = readdir($handle))){
			if(!strcmp(substr($entry, -5), ".json")){
				$name = substr($entry, 0, -5);
				echo "<div class='templateitem' id='$name'>$name
						<input type='button' value='Edit' id='$entry' class='TIedit'>
						<input type='button' value='Delete' id='$entry' class='TIdelete'>
					</div>";
			}
		}
		closedir($handle);
	}
?>