# Common settings documentation

There are several options in the plugin settings page that are common to all installation types.

## Chat behaviour

### Automatically open the chat

If checked, the chat will be loaded as soon as you are on the video page.

### Show the «open in new window» button

If your web chat tool can be opened in a full window, you can add a button to do so.

If you are using an external web chat tool (see the chat mode «Use an external web chat tool»), maybe it will not work in fullscreen (for example if it needs to access the parent window to get video informations). You can disable this button by unchecking this settings.

### Chats are only available for local videos

Peertube is a federated service. Plugins are only available on the server you are browsing.
So, if you are watching a remote video, only you will have the webchat, not users from remote instances.
Therefore, this options is checked by default and prevent displaying a webchat for remote videos.

### Users can activate the chat for their lives

If checked, all live videos will have a checkbox in their properties for enabling the web chat.
The video owner will be able to activate web chats.

### Activate chat for all lives

The chat will be available for all Peertube live videos on your instance.

### Activate chat for all non-lives

The chat will be available for all Peertube video that are not live.

### Activate chat for these videos

You can choose some UUIDs for which the chat will be available.
If you don't want te enable the feature for all videos, you can use this field to list videos UUIDs.
You can add comments: everything rights to the # character will be stripped off, as for empty lines.

### Webchat iframe style attribute

You can add some custom styles that will be added to the iframe.
For example a custom width:

```width:400px;```
