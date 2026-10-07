JavaScript

// ==UserScript==
// @name         YouTube Content Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Purges sensationalized AI panic, quantum sentience, and tech clickbait from YouTube.
// @match        https://www.youtube.com/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // List of trigger phrases to target (case-insensitive)
    const blacklistKeywords = [
        "ai panic",
        "quantum sentience",
        "artificial general intelligence is here",
        "they are conscious",
        "everything we know is wrong",
        "will change everything forever"
    ];

    // Whitelist keywords to protect (if a video title contains these, it stays)
    const whitelistKeywords = [
        "tutorial",
        "documentation",
        "coding",
        "physics",
        "guide",
        "walkthrough"
    ];

    function cleanFeed() {
        // Find standard video renderer elements on YouTube feed/search pages
        const videoItems = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer');

        videoItems.forEach(item => {
            const titleElement = item.querySelector('#video-title, yt-formatted-string.title');
            if (!titleElement) return;

            const titleText = titleElement.textContent.toLowerCase();

            // Check if it's whitelisted (protects docs/coding/physics)
            const isWhitelisted = whitelistKeywords.some(keyword => titleText.includes(keyword));
            if (isWhitelisted) return;

            // Check if it hits any blacklist trigger phrases
            const isBlacklisted = blacklistKeywords.some(keyword => titleText.includes(keyword));

            if (isBlacklisted) {
                // Instantly vaporize/hide the element from the DOM
                item.style.display = 'none';
            }
        });
    }

    // Run periodically to catch dynamically loaded content as you scroll
    const observer = new MutationObserver(() => {
        cleanFeed();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run on page load
    setTimeout(cleanFeed, 2000);
})();
