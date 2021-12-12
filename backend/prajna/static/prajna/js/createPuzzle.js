function setupCopyButton(textAreaId, btnId) {
    // Initialize the tooltip.
    $(btnId).tooltip();
    $(btnId).bind('click', function () {
        let input = document.querySelector(textAreaId);
        input.select();
        console.log("test")
        try {
            let success = document.execCommand('copy');
            if (success) {
                $(btnId).trigger('copied', ['Copied!']);
            } else {
                $(btnId).trigger('copied', ['Copy with Ctrl-c']);
            }
        } catch (err) {
            $(btnId).trigger('copied', ['Copy with Ctrl-c']);
        }
    });

    // Handler for updating the tooltip message.
    $(btnId).bind('copied', function (event, message) {
        $(this).attr('title', message)
            .tooltip('_fixTitle')
            .tooltip('show')
            .attr('title', "Copy to Clipboard")
            .tooltip('_fixTitle');
    });
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    setupCopyButton('#solidityCode', '#copySolBtn');
});
