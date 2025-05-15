<?php
// This file is generated. Do not modify it manually.
return array(
	'dmg-read-more' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gpirie/dmg-read-more',
		'version' => '1.0.0',
		'title' => 'DMG Read More',
		'category' => 'widgets',
		'icon' => 'edit',
		'description' => 'Search for related content and insert links to that content.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'customClassName' => false
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'textdomain' => 'dmg-read-more',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
