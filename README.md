# Advent of Code Restyle: Chrome Extension
This extension was originally developed because, in my opinion, the [Advent of Code](https://adventofcode.com/) website has a stylesheet that makes the site hard-to-read at best. While the main version of the extension overrides some components of the AoC stylesheet, this version only includes the additional functionality to private leaderboards&mdash;when hovering over a column in the leaderboard, the column expands to show the completion times of that day's challenge.

To install the extension, open [chrome://extensions/](chrome://extensions/), enable developer mode, then drag and drop the `extension` folder.

PLEASE NOTE: Using this extension makes two requests to AoC servers when loading private leaderboards, instead of just one. Since private leaderboard requests require the most server time, please be extra concientious about how many times you load/refresh the page, so that we can make sure everyone has a fair chance to play; try to avoid (re-)loading private leaderboards more than once per 15 minutes. (Improvements to this coming soon).

Disclaimer: This is a project that I originally developed for my own personal use. Though I try my best to make sure it works as intended, I can't guarantee that I'll be able to catch all possible issues, or that I'll have the time to resolve them. Please don't hesitate to pull-request your own changes in!
