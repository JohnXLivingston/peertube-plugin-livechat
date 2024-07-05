---
title: "Polls"
description: "You can create polls to ask viewers their opinion."
weight: 33
chapter: false
---

{{% notice info %}}
This feature comes with the livechat plugin version 10.2.0.
{{% /notice %}}

## Create a poll

You can create a new poll by using the "{{% livechat_label new_poll %}}" action in the chat top menu:

![Poll form](/peertube-plugin-livechat/images/polls_form.png?classes=shadow,border&height=200px)

{{% notice warning %}}
This poll feature should not be considered as a reliable voting system.
It is easy to cheat.
There is no mechanism to prevent anonymous users to vote multiple times by just reloading the chat.
Votes are never fully anonymous, someone having access to the server could see who voted for what choice.
{{% /notice %}}

### Poll form

Fill the form fields:

* "{{% livechat_label poll_question %}}": the question to ask to you viewers
* "{{% livechat_label poll_duration %}}": the duration for which viewers can vote
* "{{% livechat_label poll_anonymous_results %}}": if checked, votes won't be publicly visible in the chat
* "Choice N": choices that will be presented to viewers

You must at least fill the two first choices fields.

Once you submit the form, the poll will instantly start.

If there was a previous unfinished poll, it will end and its result will be shown.

### Access rights

Every room's admins can create a new poll.

When you promote someone as room admin or owner, they gets instant access to the "{{% livechat_label new_poll %}}" action.

When you remove admin or owner rights to someone, they can't create new poll. But any existing poll will continue until it ends.

Every user that is not muted can vote.
This means that you can prevent anonymous users to vote by using the ["{{% livechat_label livechat_configuration_channel_mute_anonymous_label %}}" feature](/peertube-plugin-livechat/documentation/user/streamers/moderation).

## Poll workflow

When the polls starts, a first message will be sent in the chat, from the account of the user creating the poll.

A banner will also appear to show the poll, and will be updated regularly with the current votes.

![Poll start](/peertube-plugin-livechat/images/polls_start.png?classes=shadow,border&height=200px)

Viewers can then vote by clicking on their choice, or by sending message like "!1" in the chat.

Votes counts will be updated regularly in the banner.

Viewers can change their vote at any time, just by making a new choice.
Their precedent choice will be replaced by the new one.

![Poll votes](/peertube-plugin-livechat/images/polls_votes.png?classes=shadow,border&height=200px)

{{% notice tip %}}
Anonymous viewers can only vote once they have choosen their nickname.
{{% /notice %}}

If "{{% livechat_label poll_anonymous_results %}}" is checked, votes won't be shown to other users.
If unchecked, votes will be publicly visible as you will see message like "!1" in the chat.

{{% notice info %}}
For viewers using XMPP clients or outdated livechat plugin versions, the banner will not be visible.
But they will see the message in the chat and will be able to vote by sending messages with their choices.
{{% /notice %}}

When the poll ends, a new message will be sent in the chat, with the results.

![Poll end](/peertube-plugin-livechat/images/polls_start.png?classes=shadow,border&height=200px)

{{% notice info %}}
The only way to get old polls results is to search for the poll end message in the chat.
For now, polls results are not saved by any other means.
So don't forget to note polls results if you want to keep them.
{{% /notice %}}
