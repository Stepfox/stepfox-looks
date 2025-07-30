(function (blocks, blockEditor, element, components, $) {
    const { registerBlockType } = blocks;
    const { createElement: el, Fragment } = element;
    const { InspectorControls, InnerBlocks } = blockEditor;
    const { PanelBody, SelectControl, TextareaControl } = components;
    const ServerSideRender = wp.serverSideRender;

    // Optimized icon (kept only one definition)
    const stepfox_icon = el("svg", {
        id: "Layer_1",
        "data-name": "Layer 1",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "60 20 70 20",
        children: [
            el("path", {
                fill: "#f47621",
                d: "M105.4,41.4a11.46,11.46,0,1,0-16.2,0,11.41,11.41,0,0,0,16.2,0",
                transform: "translate(-2 -2)"
            }),
            el("path", {
                fill: "#4f4f4f",
                d: "M115.9,30.5h12.7A31.52,31.52,0,0,0,100.1,2V14.7A18.57,18.57,0,0,1,110.6,20a18.88,18.88,0,0,1,5.3,10.5",
                transform: "translate(-2 -2)"
            }),
            el("path", {
                class: "cls-1",
                d: "M115.9,36.1a18.57,18.57,0,0,1-5.3,10.5,18.88,18.88,0,0,1-10.5,5.3V64.6a31.14,31.14,0,0,0,19.4-9.1,31.68,31.68,0,0,0,9.1-19.4Z",
                transform: "translate(-2 -2)"
            }),
            el("path", {
                fill: "#4f4f4f",
                d: "M78.7,36.1H66a31.14,31.14,0,0,0,9.1,19.4,31.68,31.68,0,0,0,19.4,9.1V51.9A18.57,18.57,0,0,1,84,46.6a17.69,17.69,0,0,1-5.3-10.5",
                transform: "translate(-2 -2)"
            }),
            el("path", {
                fill: "#4f4f4f",
                d: "M78.7,30.5A18.26,18.26,0,0,1,84,20a18.88,18.88,0,0,1,10.5-5.3V2a31.14,31.14,0,0,0-19.4,9.1A31.68,31.68,0,0,0,66,30.5Z",
                transform: "translate(-2 -2)"
            })
        ]
    });

    // Recursive function to search for objects that contain a given key
    const deepSearchByKey = (obj, key, matches = []) => {
        if (obj != null) {
            if (Array.isArray(obj)) {
                obj.forEach(item => deepSearchByKey(item, key, matches));
            } else if (typeof obj === "object") {
                Object.keys(obj).forEach(k => {
                    if (k === key) {
                        matches.push(obj);
                    } else {
                        deepSearchByKey(obj[k], key, matches);
                    }
                });
            }
        }
        return matches;
    };

    registerBlockType("examiner/metafield-block", {
        title: "Metafield Block",
        icon: stepfox_icon,
        category: "examiner",
        example: {},
        supports: {
            spacing: {
                margin: true,
                padding: true,
                blockGap: true,
                __experimentalDefaultControls: {
                    margin: true,
                    padding: true,
                    blockGap: true,
                },
            },
            align: ["left", "right", "full", "wide", "center"],
            color: {
                background: true,
                gradients: true,
                link: true,
                text: true,
            },
            typography: {
                fontSize: true,
                lineHeight: true,
                __experimentalFontFamily: true,
                __experimentalFontWeight: true,
                __experimentalFontStyle: true,
                __experimentalTextTransform: true,
                __experimentalLetterSpacing: true,
                __experimentalTextDecoration: true,
            },
            __experimentalBorder: {
                color: true,
                radius: true,
                style: true,
                width: true,
            },
            __experimentalLayout: {
                allowSwitching: true,
                allowInheriting: true,
                default: {
                    type: "flex",
                },
            },
        },
        attributes: {
            style: {
                type: "object",
                default: {
                    elements: { link: "" },
                    border: { radius: "", style: "", width: "" },
                    color: {},
                    spacing: { blockGap: "", margin: { top: "" }, padding: { top: "" } },
                },
            },
            post_type: { type: "string", default: "post" },
            element_type: { type: "string", default: "p" },
            select_a_post_options: { type: "array", source: "attr", default: [] },
            select_a_post: { type: "string", default: "" },
            customId: { type: "string", default: "stepfox-not-set-id" },
            custom_css: { type: "string", default: "" },
            backgroundColor: { type: "string", default: "" },
            gradient: { type: "string", default: "" },
            linkColor: { type: "string", default: "" },
            textColor: { type: "string", default: "" },
            fontSize: { type: "string", default: "" },
            fontFamily: { type: "string", default: "" },
            fontWeight: { type: "string", default: "" },
            fontStyle: { type: "string", default: "" },
            textTransform: { type: "string", default: "" },
            letterSpacing: { type: "string", default: "" },
            borderColor: { type: "string", default: "" },
            align: { type: "string", default: "wide" },
            meta_field: { type: "string", default: "post_title" },
            layout: { type: "object", default: {} },
        },
        edit: function (props) {
            const { attributes, setAttributes, clientId } = props;
            const { post_type, element_type } = attributes;

            // If the element type is "link", update innerContent
            if (element_type === "link") {
                setAttributes({
                    innerContent: wp.blocks.getBlockContent(
                        wp.data.select("core/block-editor").getBlock(clientId)
                    ),
                });
            }

            return el(
                Fragment,
                {},
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: "Block Options", initialOpen: true },
                        el(SelectControl, {
                            __next40pxDefaultSize: true,
                            __nextHasNoMarginBottom: true,
                            label: "Post Type",
                            options: metafield_block.post_types,
                            onChange: value => {
                                if (post_type !== value) {
                                    setAttributes({
                                        select_a_post: String(
                                            metafield_block.manual_selection[value][0].value
                                        ),
                                        // Reset meta_field when post type changes to avoid invalid combinations
                                        meta_field: metafield_block.metafields[value] && metafield_block.metafields[value][0] 
                                            ? metafield_block.metafields[value][0].value 
                                            : 'post_title'
                                    });
                                }
                                setAttributes({ post_type: value });
                            },
                            value: post_type,
                        }),
                        el(SelectControl, {
                            __next40pxDefaultSize: true,
                            __nextHasNoMarginBottom: true,
                            label: "Element Type",
                            options: [
                                { value: "div", label: "div" },
                                { value: "h1", label: "h1" },
                                { value: "h2", label: "h2" },
                                { value: "h3", label: "h3" },
                                { value: "p", label: "p" },
                                { value: "link", label: "Link" },
                                { value: "image", label: "Image" },
                                { value: "stat", label: "Stat" },
                                { value: "css_attribute", label: "Css" },
                            ],
                            onChange: value => setAttributes({ element_type: value }),
                            value: element_type,
                        }),
                        el(SelectControl, {
                            __next40pxDefaultSize: true,
                            __nextHasNoMarginBottom: true,
                            label: "Field To Display",
                            help: "Only fields registered for the selected post type are shown. (registered) = WordPress registered meta, (ACF) = ACF fields, (custom) = other custom fields",
                            options: metafield_block.metafields[post_type] || [
                                { value: 'post_title', label: 'post_title' }
                            ],
                            onChange: value => setAttributes({ meta_field: value }),
                            value: attributes.meta_field,
                        }),
                        el(SelectControl, {
                            __next40pxDefaultSize: true,
                            __nextHasNoMarginBottom: true,
                            label: "Select a Post",
                            options: metafield_block.manual_selection[post_type],
                            onChange: value => setAttributes({ select_a_post: value }),
                            value: attributes.select_a_post,
                        })
                                        ),
                    el(
                        PanelBody,
                        { title: "Custom Css", initialOpen: false },
                        el(TextareaControl, {
                            label: "Custom Css",
                            help:
                                "Here you can write custom css. Example: (this_block .high-title a { color: #F00; })",
                            onChange: value => setAttributes({ custom_css: value }),
                            value: attributes.custom_css,
                        })
                    )
                ),
                element_type === "link"
                    ? el(InnerBlocks, { templateInsertUpdatesSelection: true })
                    : el(ServerSideRender, {
                        block: "examiner/metafield-block",
                        attributes: attributes,
                        httpMethod: "POST",
                    })
            );
        },
        save: function () {
            return el(InnerBlocks.Content);
        },
    });
})(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components,
    window.jQuery
);
