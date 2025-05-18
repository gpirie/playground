<?php
/**
 * Plugin Name: DMG: Read More
 * Description: Search for related content and insert links to that content.
 * Version: 1.0.0
 * Requires at least: 5.8
 * Requires PHP: 5.6.20
 * Author: Graeme Pirie
 * License: GPLv2 or later
 * Text Domain: readmore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function create_block_dmg_read_more_block_init() {
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';

	foreach ( array_keys( $manifest_data ) as $block_type ) {
		$render_path = __DIR__ . "/build/{$block_type}/render.php";
		if ( file_exists( $render_path ) ) {
			require_once $render_path;
		}

		register_block_type(
			__DIR__ . "/build/{$block_type}",
			[
				'render_callback' => 'render_dmg_read_more_block',
			]
		);
	}
}
add_action( 'init', 'create_block_dmg_read_more_block_init' );

// Optional: Load CLI command
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once __DIR__ . '/cli/cli.php';
}
