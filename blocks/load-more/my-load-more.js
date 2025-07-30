(function($) {
    $(document).ready(function() {
        var currentPage = 1;

        $('.query-loop-load-more-button').on('click', function(e) {
            e.preventDefault();
            var button = $(this);
            var parent_id = button.closest('.wp-block-query').attr('id').replace('block_', '');
            var innerBlocksString = heya[parent_id]['innerBlocksString'];
            var context = heya[parent_id]['context'];
            var query_args = heya[parent_id]['query_args'];
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
                success: function(data) {
                    if (data) {
                        // Append the loaded posts to the Query Loop container
                        button.closest('.wp-block-query').find('ul').append(data);
                        currentPage++;
                        button.text('Load More');
                    } else {
                        button.remove();
                    }
                },
                error: function() {
                    button.text('Load More');
                }
            });
        });
    });
})(jQuery);
