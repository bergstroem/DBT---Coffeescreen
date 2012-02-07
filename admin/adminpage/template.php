<html>
	<body>
		<?php
			function handleTemplate($mode, $filename){
				if(!strcmp($mode,"delete")){
					deleteTemplate($filename);
				}
				else{
					displayForm($mode, $filename);
				}
			}
			
			function displayForm($mode, $filename){
				if(!strcmp($mode,"new")){
					echo "<form method='post' action='template.php?p=1'>";
					$name = "";
					$note = "";
					$maincontent = "";
					$subcontent = "";
				}
				else if(!strcmp($mode,"edit")){
					echo "<form method='post' action='template.php?p=2&filename=$filename'>";
					$fh = fopen("$filename", "r");
					$content = fread($fh, filesize($filename));
					fclose($fh);
					$splity = preg_split('/ | /',$content, -1);
				
					$name = $splity[0];
					$note = $splity[2];
					$maincontent = $splity[4];
					$subcontent = $splity[6];
				}
				
				echo "<div id='formcontent'>
					<p>
						Name
					</p>
					<p>
						<input type='text' required='required' name='name' value=$name></input>
					</p>
					<p>
						Note
					</p>
					<p>
						<textarea id='TAform' name='note'>$note</textarea>
					</p>
					<p>
						<input id='formbutton' type='submit' value='Save'/>
						<button id='formbutton' type='button' onclick=\"window.location.href='admintemplate.php'\">Cancel</button>
					</p>
				</div>
				<div id='rsscontent'>
					<p>
						Main content
					</p>
					<p>
						<textarea id='TArss' required='required' name='maincontent'>$maincontent</textarea>
					</p>
					<p>
						Sub content
					</p>
					<p>
						<textarea id='TArss' name='subcontent'>$subcontent</textarea>
					</p>
				</div>
				";
				echo "</form>";
			}
			
			function deleteTemplate($filename){
				unlink($filename);
				header("location: admintemplate.php");
			}
			
			if($_GET['p'] == 1){
				$templatename = $_POST['name'];
				$note = $_POST['note'];
				$maincontent = $_POST['maincontent'];
				$subcontent = $_POST['subcontent'];

				$data = "$templatename | $note | $maincontent | $subcontent";

				$fh = fopen("$templatename.txt", "w");
				fwrite($fh, $data);

				fclose($fh);
				header("location: admintemplate.php");
			}
			else if($_GET['p'] == 2){
				$filename = $_GET['filename'];
				unlink($filename);
				$templatename = $_POST['name'];
				$note = $_POST['note'];
				$maincontent = $_POST['maincontent'];
				$subcontent = $_POST['subcontent'];

				$data = "$templatename | $note | $maincontent | $subcontent";

				$fh = fopen("$templatename.txt", "w");
				fwrite($fh, $data);

				fclose($fh);
				header("location: admintemplate.php");
			}
		?>
	</body>
</html>
