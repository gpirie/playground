import { useState, useEffect } from '@wordpress/element';
import { ComboboxControl, PanelBody, Spinner } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: 'dmg-read-more' });

	const { postId } = attributes;

	const [input, setInput] = useState('');
	const [recentPosts, setRecentPosts] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [selectedPostData, setSelectedPostData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// Load first 20 posts on mount
	useEffect(() => {
		setIsLoading(true);
		apiFetch({ path: `/wp/v2/posts?status=publish&per_page=20` })
			.then(setRecentPosts)
			.catch(() => setRecentPosts([]))
			.finally(() => setIsLoading(false));
	}, []);

	// Search posts when input changes
	useEffect(() => {
		if (!input) return;

		const timeout = setTimeout(() => {
			setIsLoading(true);

			const isNumeric = /^\d+$/.test(input);

			const fetchPromise = isNumeric
				? apiFetch({ path: `/wp/v2/posts/${input}` })
					.then((post) => (post && post.id ? [post] : []))
					.catch(() => [])
				: apiFetch({
					path: `/wp/v2/posts?search=${encodeURIComponent(input)}&status=publish&per_page=20`,
				})
					.then((posts) => posts)
					.catch(() => []);

			fetchPromise
				.then((posts) => setSearchResults(posts))
				.finally(() => setIsLoading(false));
		}, 400);

		return () => clearTimeout(timeout);
	}, [input]);

	// Fetch post data for selected postId
	useEffect(() => {
		if (!postId) return;

		apiFetch({ path: `/wp/v2/posts/${postId}` })
			.then(setSelectedPostData)
			.catch(() => setSelectedPostData(null));
	}, [postId]);

	// Combine post lists
	const getOptions = () => {
		let list = input ? searchResults : recentPosts;

		// Include selected post if missing
		if (selectedPostData && !list.some((p) => p.id === selectedPostData.id)) {
			list = [selectedPostData, ...list];
		}

		return list.map((post) => ({
			value: post.id.toString(),
			label: `${post.title.rendered || `Post #${post.id}`} (ID: ${post.id})`,
		}));
	};

	// Only generate options once selectedPostData is loaded (or not needed)
	const options = getOptions();

	return (
		<>
			<InspectorControls>
				<PanelBody title="Search for Content" initialOpen={true}>
					<ComboboxControl
						label={__('Select a Post', 'readmore')}
						value={postId !== undefined ? postId.toString() : ''}
						options={options}
						onChange={(value) => {
							setAttributes({ postId: parseInt(value, 10) });
						}}
						onFilterValueChange={setInput}
						disabled={isLoading}
						help={__('Search for a post to add a link to. The line will be prepended with Read More: ', 'readmore')}
					/>
					{isLoading && <Spinner />}
				</PanelBody>
			</InspectorControls>

			<p {...blockProps}>
				{selectedPostData ? (
					<>
						Read More:{' '}
						<a
							className="dmg-read-more__link"
							href={selectedPostData.link}
							title={selectedPostData.title.rendered}
						>
							{selectedPostData.title.rendered}
						</a>
					</>
				) : (
					__('No post selected.', 'readmore')
				)}
			</p>
		</>
	);
}
