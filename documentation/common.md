# Common settings documentation

There are several options in the plugin settings page that are common to all installation types.

## Automatically open the chat

If checked, the chat will be loaded as soon as you are on the video page.

## Show the «open in new window» button

If your webchat can be opened in a full window, you can add a button to do so.

NB: The builtin ConverseJS is compatible with this feature.

## Chats are only available for local videos

Peertube is a federated service. Plugins are only available on the server you are browsing.
So, if you are watching a remote video, only you will have the webchat, not users from remote instances.
Therefore, this options is checked by default and prevent displaying a webchat for remote videos.

## Activate chat for all lives

The chat will be available for all Peertube Live on your instance.
This is the main purpose of this plugin: providing a chatting experience to user watching a live video.

## Activate chat for all non-lives

The chat will be available for all Peertube video that are not live.

## Activate chat for specific videos

You can choose some UUIDs for which the chat will be available.
If you don't want te enable the feature for all videos, you can use this field to list videos UUIDs.
You can add comments: everything rights to the # character will be stripped off, as for empty lines.

NB: this feature will probably soon disappear. I planned to add a checkbox in each video settings.

### Webchat iframe style attribute

You can add some custom styles that will be added to the iframe.
For example a custom width:

```width:400px;```
