<?php
function render_dmg_read_more_block( $attributes ) {

	// Return early if criteria not met.
    if ( empty( $attributes['postId'] ) ) {
        return '';
    }

    $post = get_post( $attributes['postId'] );
    if ( ! $post ) {
        return '';
    }

	// Apply a filterable prefix to the links
	$prefix = apply_filters( 'dmg_read_more_prefix_text', __( 'Read More', 'dmg-read-more' ) );

	// Return paragraph element with a link inside.
    return sprintf(
        '<p class="dmg-read-more">
			%1$s
			<a class="dmg-read-more__link" href="%2$s">%3$s</a>
		</p>',
		esc_html( $prefix ),
		esc_url( get_permalink( $post ) ),
		esc_html( get_the_title( $post ) )
    );
}

return 'render_dmg_read_more_block';
