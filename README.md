# PeerTube plugin livechat *ALPHA VERSION*

Work In Progress

Plugin that allows to integrated an iframe with an external webchat application.

This is under development. It is not functional yet.

For now, there is no documentation for how you can setup the webchat.
It has to be setup by your own. For example with a XMPP Server and the ConverseJS Javascript.

Next step: document how you can setup the XMPP server.

## ConverseJS

Once you have a XMPP server that allow anonymous authentication, with bosh
(or websocket) enabled, you can - for example - setup a html page that looks like
[this one](documentation/examples/converseJS/index.html). You have of course to
replace the path /conversejs/7.0.3 with your converseJS path, and replace your_domain
by your actual domain.

NB : there is a bug in the converseJS 7.0.4 release. The dist files don't work.
So if you are not building converseJS yourself, use version 7.0.3 instead.
