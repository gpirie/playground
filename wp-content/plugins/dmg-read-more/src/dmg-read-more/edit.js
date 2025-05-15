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
	const [selectedPostData, setSelectedPostData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// 🔁 Load 20 most recent posts on mount
	useEffect(() => {
		setIsLoading(true);
		apiFetch({ path: `/wp/v2/posts?status=publish&per_page=20` })
			.then((posts) => setRecentPosts(posts))
			.catch(() => setRecentPosts([]))
			.finally(() => setIsLoading(false));
	}, []);

	// 🔍 Debounced search on input
	useEffect(() => {
		if (!input) return;

		const timeout = setTimeout(() => {
			setIsLoading(true);
			apiFetch({
				path: `/wp/v2/posts?search=${encodeURIComponent(input)}&status=publish&per_page=20`,
			})
				.then((posts) => setSearchResults(posts))
				.catch(() => setSearchResults([]))
				.finally(() => setIsLoading(false));
		}, 400);

		return () => clearTimeout(timeout);
	}, [input]);

	// ✅ Load the selected post if it's not already in the list
	useEffect(() => {
		if (!postId) return;

		apiFetch({ path: `/wp/v2/posts/${postId}` })
			.then((post) => setSelectedPostData(post))
			.catch(() => setSelectedPostData(null));
	}, [postId]);

	// 🔗 Combine selectedPostData with current results (if missing)
	let displayedPosts = input ? searchResults : recentPosts;

	if (
		selectedPostData &&
		!displayedPosts.find((p) => p.id === selectedPostData.id)
	) {
		displayedPosts = [selectedPostData, ...displayedPosts];
	}

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
						label={__('Select a Post', 'readmore')}
						value={postId}
						options={options}
						onChange={
							(value) => setAttributes(
								{ postId: value }
							)
						}
						onFilterValueChange={
							(value) => setInput(value)
						}
						disabled={isLoading}
					/>
				</PanelBody>
			</InspectorControls>

			<p {...useBlockProps()}>
				{selectedPost
					? `Selected: ${selectedPost.title.rendered}`
					: __('No post selected.', 'readmore')}
			</p>
		</>
	);
}
