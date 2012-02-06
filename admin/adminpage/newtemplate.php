<html>
	<body>
		<?php
			$templatename = $_POST['name'];
			$note = $_POST['note'];
			$maincontent = $_POST['maincontent'];
			$subcontent = $_POST['subcontent'];

			//the data
			$data = "$templatename | $note | $maincontent | $subcontent\n";

			//open the file and choose the mode
			$fh = fopen("$templatename.txt", "w");
			fwrite($fh, $data);

			//close the file
			fclose($fh);
		?>
	</body>
</html>
