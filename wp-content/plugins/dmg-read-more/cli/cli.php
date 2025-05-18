<?php

if ( ! class_exists( 'WP_CLI' ) ) {
	return;
}

class DMG_Read_More_Command {

	const POSTS_PER_PAGE = 500;

	/**
	 * Search for posts with the 'gpirie/dmg-read-more' block within a date range.
	 *
	 * ## OPTIONS
	 *
	 * [--date-before=<date>]
	 * : Optional. Upper bound date (YYYY-MM-DD).
	 *
	 * [--date-after=<date>]
	 * : Optional. Lower bound date (YYYY-MM-DD).
	 *
	 * ## EXAMPLES
	 *
	 *     wp dmg-read-more search --date-after=2025-04-01 --date-before=2025-04-30
	 *
	 * @when after_wp_load
	 */
	public function search( $args, $assoc_args ) {
		$date_before = $assoc_args['date-before'] ?? current_time('Y-m-d');
		$date_after  = $assoc_args['date-after'] ?? date('Y-m-d', strtotime('-30 days'));

		WP_CLI::log( "Searching for posts with 'gpirie/dmg-read-more' between {$date_after} and {$date_before}..." );

		$paged         = 1;
		$total_matched = 0;

		do {
			$query_args = [
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => self::POSTS_PER_PAGE,
				'paged'          => $paged,
				'date_query'     => [
					[
						'after'     => $date_after,
						'before'    => $date_before,
						'inclusive' => true,
					],
				],
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'orderby'        => 'ID',
				'order'          => 'ASC',
			];

			$query = new WP_Query( $query_args );
			$post_ids = $query->posts;

			if ( empty( $post_ids ) ) {
				break;
			}

			foreach ( $post_ids as $post_id ) {
				$content = get_post_field( 'post_content', $post_id );

				if ( str_contains( $content, 'gpirie/dmg-read-more' ) ) {
					WP_CLI::log( $post_id );
					$total_matched++;
				}
			}

			$paged++;
		} while ( count( $post_ids ) === self::POSTS_PER_PAGE );

		if ( $total_matched === 0 ) {
			WP_CLI::warning( 'No posts contained the dmg-read-more block.' );
		} else {
			WP_CLI::success( "{$total_matched} post(s) matched." );
		}
	}
}

WP_CLI::add_command( 'dmg-read-more', 'DMG_Read_More_Command' );
