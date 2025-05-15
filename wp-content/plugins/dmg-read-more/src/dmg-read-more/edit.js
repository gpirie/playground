/** Required imports */
import { useEffect, useState } from 'react';
const { useSelect } = wp.data;
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody
} from '@wordpress/components';

/**
 * Styles
 */
import './editor.scss';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {

	// Get post data
	const { posts } = useSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );

		// Query args
		const query = {
			status: 'publish',
			per_page: 2
		}

		return {
			pages: getEntityRecords( 'postType', 'page', query ),
		}
	} )

	return (
		<>
			<InspectorControls>
				<PanelBody title="Search for Content" initialOpen={ true }>

				</PanelBody>
			</InspectorControls>

			<p { ...useBlockProps() }>
				{ __( 'Dmg Read More – hello from the editor!', 'dmg-read-more' ) }
			</p>
		</>
	);
}
