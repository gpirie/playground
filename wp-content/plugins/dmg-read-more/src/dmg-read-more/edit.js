import { useState, useEffect } from '@wordpress/element';
import { ComboboxControl, PanelBody } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
	const { postId } = attributes;

	const [input, setInput] = useState('');
	const [recentPosts, setRecentPosts] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Load recent posts on mount
	useEffect(() => {
		setIsLoading(true);
		apiFetch({
			path: `/wp/v2/posts?status=publish&per_page=20`,
		})
			.then((posts) => setRecentPosts(posts))
			.catch(() => setRecentPosts([]))
			.finally(() => setIsLoading(false));
	}, []);

	// Debounced search on input
	useEffect(() => {
		if (!input) return;

		const timeout = setTimeout(() => {
			setIsLoading(true);
			apiFetch({
				path: `/wp/v2/posts?search=${encodeURIComponent(input)}&status=publish&per_page=100`,
			})
				.then((posts) => setSearchResults(posts))
				.catch(() => setSearchResults([]))
				.finally(() => setIsLoading(false));
		}, 400);

		return () => clearTimeout(timeout);
	}, [input]);

	// Decide which list to show
	const displayedPosts = input ? searchResults : recentPosts;

	const options = displayedPosts.map((post) => ({
		value: post.id,
		label: post.title.rendered || `Post #${post.id}`,
	}));

	const selectedPost = displayedPosts.find((p) => p.id === postId);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Search for Content" initialOpen={true}>
					<ComboboxControl
						label={__('Select a Post', 'your-textdomain')}
						value={postId}
						options={options}
						onChange={(value) => setAttributes({ postId: value })}
						onFilterValueChange={(val) => setInput(val)}
						disabled={isLoading}
					/>
				</PanelBody>
			</InspectorControls>

			<p {...useBlockProps()}>
				{selectedPost
					? `Selected: ${selectedPost.title.rendered}`
					: __('No post selected.', 'your-textdomain')}
			</p>
		</>
	);
}
