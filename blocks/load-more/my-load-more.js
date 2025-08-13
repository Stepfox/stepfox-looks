(function($) {
    $(document).ready(function() {
        var currentPage = 1;

        $('.query-loop-load-more-button').on('click', function(e) {
            e.preventDefault();
            var button = $(this);
            var parent_id = button.closest('.wp-block-query').attr('id');
            if (!parent_id) { console.error('Load More: parent query id not found'); return; }
            parent_id = parent_id.replace('block_', '');
            var store = (window.stepfoxHeya && typeof window.stepfoxHeya === 'object') ? window.stepfoxHeya : {};
            if (!store[parent_id]) { console.error('Load More: data missing for', parent_id); return; }
            var innerBlocksString = store[parent_id]['innerBlocksString'];
            var context = store[parent_id]['context'];
            var query_args = store[parent_id]['query_args'];
            $.ajax({
                url: stepfox_load_more_params.ajaxurl,
                type: 'POST',
                data: {
                    action: 'load_more_posts',
                    context: context,
                    query_args: query_args,
                    paged: currentPage + 1,
                    innerBlocksString: innerBlocksString,
                    nonce: stepfox_load_more_params.nonce
                },
                beforeSend: function() {
                    button.text('Loading...');
                },
                success: function(response) {
                    // Handle improved JSON response format
                    if (response.success && response.data && response.data.html) {
                        // Append the loaded posts to the Query Loop container
                        button.closest('.wp-block-query').find('ul').append(response.data.html);
                        currentPage++;
                        button.text('Load More');
                        
                        // Hide button if no more posts available
                        if (response.data.found_posts === 0 || response.data.html === '') {
                            button.fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    } else if (response.success && response.data && response.data.html === '') {
                        // No more posts available
                        button.fadeOut(300, function() {
                            $(this).remove();
                        });
                    } else {
                        // Handle error response
                        console.error('Load More Error:', response.data ? response.data.message : 'Unknown error');
                        button.text('Error - Try Again');
                        setTimeout(function() {
                            button.text('Load More');
                        }, 3000);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    button.text('Error - Try Again');
                    setTimeout(function() {
                        button.text('Load More');
                    }, 3000);
                }
            });
        });
    });
})(jQuery);
