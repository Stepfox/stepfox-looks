/**
 * Stepfox Looks Admin JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Cache clear functionality
        $('#stepfox-clear-cache').on('click', function(e) {
            e.preventDefault();
            clearCache();
        });

        // Individual cache clear functionality
        $(document).on('click', '.stepfox-clear-single', function(e) {
            e.preventDefault();
            var cacheKey = $(this).data('cache-key');
            clearSingleCache(cacheKey, $(this));
        });

        // Toggle change handler
        $('input[name="stepfox_looks_cache_enabled"]').on('change', function() {
            var isEnabled = $(this).is(':checked');
            var message = isEnabled ? 
                'Cache has been enabled. Don\'t forget to save settings.' : 
                'Cache has been disabled. Don\'t forget to save settings.';
            
            showNotice(message, 'info');
        });
    });

    /**
     * Clear cache via AJAX
     */
    function clearCache() {
        var $button = $('#stepfox-clear-cache');
        var $status = $('#stepfox-cache-status');
        var originalText = $button.text();

        // Disable button and show loading
        $button.prop('disabled', true);
        $button.html('<span class="stepfox-loading"></span>' + stepfoxAdmin.messages.clearing);
        $status.hide();

        $.ajax({
            url: stepfoxAdmin.ajax_url,
            type: 'POST',
            data: {
                action: 'stepfox_clear_cache',
                nonce: stepfoxAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    $status.find('.stepfox-success').text(response.data.message);
                    $status.show();
                    
                    // Auto-hide success message after 3 seconds
                    setTimeout(function() {
                        $status.fadeOut();
                    }, 3000);
                } else {
                    showNotice(stepfoxAdmin.messages.error, 'error');
                }
            },
            error: function() {
                showNotice(stepfoxAdmin.messages.error, 'error');
            },
            complete: function() {
                // Re-enable button
                $button.prop('disabled', false);
                $button.text(originalText);
            }
        });
    }

    /**
     * Clear single cache entry via AJAX
     */
    function clearSingleCache(cacheKey, $button) {
        var originalText = $button.text();
        var $row = $button.closest('tr');

        // Disable button and show loading
        $button.prop('disabled', true);
        $button.html('<span class="stepfox-loading"></span>' + stepfoxAdmin.messages.single_clearing);

        $.ajax({
            url: stepfoxAdmin.ajax_url,
            type: 'POST',
            data: {
                action: 'stepfox_clear_single_cache',
                nonce: stepfoxAdmin.single_nonce,
                cache_key: cacheKey
            },
            success: function(response) {
                if (response.success) {
                    // Remove the row with animation
                    $row.fadeOut(300, function() {
                        $(this).remove();
                        
                        // Update cache count
                        var $tbody = $('.stepfox-cache-table tbody');
                        var remainingRows = $tbody.find('tr').length;
                        
                        if (remainingRows === 0) {
                            // Show "no cache" message
                            $('.stepfox-cache-table-wrapper').replaceWith(
                                '<p class="stepfox-no-cache">No cache entries found.</p>'
                            );
                            $('.stepfox-cache-summary').hide();
                        } else {
                            // Update summary count
                            $('.stepfox-cache-summary').text('Total: ' + remainingRows + ' cache entries');
                        }
                    });
                    
                    showNotice(stepfoxAdmin.messages.single_cleared, 'success');
                } else {
                    showNotice(stepfoxAdmin.messages.error, 'error');
                    // Re-enable button
                    $button.prop('disabled', false);
                    $button.text(originalText);
                }
            },
            error: function() {
                showNotice(stepfoxAdmin.messages.error, 'error');
                // Re-enable button
                $button.prop('disabled', false);
                $button.text(originalText);
            }
        });
    }

    /**
     * Show admin notice
     */
    function showNotice(message, type) {
        var noticeClass = 'notice notice-' + type + ' is-dismissible';
        var $notice = $('<div class="' + noticeClass + '"><p>' + message + '</p></div>');
        
        $('.wrap h1').after($notice);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            $notice.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    /**
     * Handle settings form submission
     */
    $('form').on('submit', function() {
        var $form = $(this);
        var $submit = $form.find('input[type="submit"]');
        var originalValue = $submit.val();

        $submit.val('Saving...');
        $submit.prop('disabled', true);

        // Re-enable after a delay (WordPress will redirect)
        setTimeout(function() {
            $submit.val(originalValue);
            $submit.prop('disabled', false);
        }, 1000);
    });

})(jQuery);