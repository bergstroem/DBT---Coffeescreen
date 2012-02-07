<html>
	<head>
		<title>Test</title>

		<!--<style type="text/css">
			body {
				font:12px/1.4em Verdana, sans-serif;
				color:#333;
				background-color:#fff;
				width:700px;
				margin:50px auto;
				padding:0;
			}
		 
			a {
				color:#326EA1;
				text-decoration:underline;
				padding:0 1px;
			}
		 
			a:hover {
				background-color:#333;
				color:#fff;
				text-decoration:none;
			}
		 
			div.header {
				border-bottom:1px solid #999;
			}
		 
			div.item {
				padding:5px 0;
				border-bottom:1px solid #999;
			}
		</style>-->
	</head>
	<body>

		<?php
			require_once('simplepie.inc');
			
			$feedSourcesArray = explode(";", $_GET["feeds"]);
			
			$feed = new SimplePie();
			$feed->set_feed_url($feedSourcesArray);
			$feed->init();
			$feed->handle_content_type();
			
			$posts = array();
			
			foreach ($feed->get_items() as $item):
				$title = $item->get_title();
				$desc = $item->get_description();

				$posts[] = array('title' => $title, 'desc' => $desc);
				
			endforeach;

			$response = array();
			$response['posts'] = $posts;

			echo json_encode($response);

			/*$myFile = "testFile.json";
			$fp = fopen($myFile, 'w');
			fwrite($fp, json_encode($response));
			fclose($fp);*/
			
		?>
		<!--
		<?php $feed->get_title(); ?>
	
			<div class="header">
			<h1><a href="<?php echo $feed->get_permalink(); ?>"><?php echo $feed->get_title(); ?></a></h1>
			<p><?php echo $feed->get_description(); ?></p>
			</div>
 
		<?php
		/*
		Here, we'll loop through all of the items in the feed, and $item represents the current item in the loop.
		*/
		foreach ($feed->get_items() as $item):
		?>
	 
			<div class="item">
				<h2><a href="<?php echo $item->get_permalink(); ?>"><?php echo $item->get_title(); ?></a></h2>
				<p><?php echo $item->get_description(); ?></p>
				<p><small>Posted on <?php echo $item->get_date('j F Y | g:i a'); ?></small></p>
			</div>
	 
		<?php endforeach; ?>
		
		-->
	</body>
</html>
