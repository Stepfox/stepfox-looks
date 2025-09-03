(function() {
    var coverBlocksFixed = {};

    if (window.wp && window.wp.data) {
        var unsubscribe = window.wp.data.subscribe(function() {
            var blocks = window.wp.data.select('core/block-editor').getBlocks();

            function checkBlocks(blockList) {
                blockList.forEach(function(block) {
                    if (block.name === 'core/cover' && !coverBlocksFixed[block.clientId]) {
                        var parentBlocks = window.wp.data.select('core/block-editor').getBlockParents(block.clientId);
                        var queryBlock = null;

                        parentBlocks.forEach(function(parentId) {
                            var parent = window.wp.data.select('core/block-editor').getBlock(parentId);
                            if (parent && parent.name === 'core/query') {
                                queryBlock = parent;
                            }
                        });

                        if (queryBlock && queryBlock.attributes.query && queryBlock.attributes.query.postType !== 'post') {
                            var newAttributes = {};
                            var needsUpdate = false;

                            if (block.attributes.useFeaturedImage) {
                                newAttributes.useFeaturedImage = false;
                                needsUpdate = true;
                            }

                            if (block.attributes.linkToPost) {
                                newAttributes.linkToPost = false;
                                needsUpdate = true;
                            }

                            if (needsUpdate) {
                                window.wp.data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, newAttributes);
                                coverBlocksFixed[block.clientId] = true;
                            }
                        }
                    }

                    if (block.innerBlocks && block.innerBlocks.length > 0) {
                        checkBlocks(block.innerBlocks);
                    }
                });
            }

            checkBlocks(blocks);
        });
    }
})();


