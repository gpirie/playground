<?php
function render_dmg_read_more_block( $attributes ) {
    if ( empty( $attributes['postId'] ) ) {
        return '';
    }

    $post = get_post( $attributes['postId'] );
    if ( ! $post ) {
        return '';
    }

    $title = esc_html( get_the_title( $post ) );
    $permalink = esc_url( get_permalink( $post ) );

    echo 'render';

    return sprintf(
        '<p class="dmg-read-more"><a href="%s">Read more: %s</a></p>',
        $permalink,
        $title
    );
}

return 'render_dmg_read_more_block';
