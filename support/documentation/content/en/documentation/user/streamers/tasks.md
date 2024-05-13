---
title: "Tasks / TODO-list"
description: "You can handle tasks ans task lists with your moderation team."
weight: 35
chapter: false
---

{{% notice info %}}
This feature comes with the livechat plugin version 10.0.0.
{{% /notice %}}

## Introduction

The livechat plugin includes a Task Application: a kind of "TODO-list" features where you can create task lists and add tasks to them.
All room's admins have access to these tasks, so you can edit them collaboratively.

You can for example use the Task Application to:

* prepare a list of themes you want to discuss during your live stream, so you can be sure you won't forget anything
* note down questions from your viewers, so you can come back to them later without forgetting to answer them
* ...

## Using the Task Application

### Opening the Task Application

To open the Task Application, there is a "{{% livechat_label "tasks" %}}" button in the chat top menu:

![Opening the Task Application](/peertube-plugin-livechat/images/task_open_app_video.png?classes=shadow,border&height=200px)

![Opening the Task Application](/peertube-plugin-livechat/images/task_open_app_fullpage.png?classes=shadow,border&height=200px)

Click this button will toggle the Task Application display:

![Task Application](/peertube-plugin-livechat/images/task_app_video_1.png?classes=shadow,border&height=200px)

![Task Application](/peertube-plugin-livechat/images/task_app_fullpage_1.png?classes=shadow,border&height=200px)

{{% notice tip %}}
Open the chat in full page, to have more space and better readability.
{{% /notice %}}

### Access rights

All room's admins have access to the Task Application (read and write access).

When you promote someone as room admin or owner, he/she gets instantly access to the Task Application.
When you remove admin or owner rights to someone, he/she instantly loses access to the Task Application.

### Task lists

By default, there is one task list that has the same name as your live stream.

You can use the form at the bottom to create a new task list.
You can also edit existing tasks list using the edit button, or delete any task list (deleting a task list will also delete all its tasks).

Task lists are sorted alphabetically.

![Task lists](/peertube-plugin-livechat/images/task_app_task_lists.png?classes=shadow,border&height=200px)

{{% notice tip %}}
All modification are instantly visible in all your browser tabs, and for all room admins.
{{% /notice %}}

### Tasks

#### Create tasks

You can create task using the button on the right of tasks lists.
This opens a form with two fields: a mandatory task name, and an optional description.

![Task form](/peertube-plugin-livechat/images/task_app_task_form.png?classes=shadow,border&height=200px)

![Task created](/peertube-plugin-livechat/images/task_app_task_1.png?classes=shadow,border&height=200px)

#### Edit tasks

Tasks can be edited by using the edit button on the right.

Tasks can be completed (or uncompleted) by clicking directly on the checkbox in the list.

![Tasks](/peertube-plugin-livechat/images/task_app_task_2.png?classes=shadow,border&height=200px)

#### Sorting tasks / change task list

You can sort tasks, or move tasks from a list to another, simply using drag & drop.

![Drag and drop to sort](/peertube-plugin-livechat/images/task_drag_drop.png?classes=shadow,border&height=200px)

![Drag and drop to move to another list](/peertube-plugin-livechat/images/task_drag_drop_task_list.png?classes=shadow,border&height=200px)

#### Create a task from a chat message

You can create a task from a message in a chat, using the "{{% livechat_label "task_create" %}}" button in the dropdown menu at the right of the message.
This will open a dialog where you can choose in which task list you want to add the task.
The task name will be the user nickname, and the task description the message content.

![Create task from message](/peertube-plugin-livechat/images/task_from_message_1.png?classes=shadow,border&height=200px)

![Choose the task list](/peertube-plugin-livechat/images/task_from_message_2.png?classes=shadow,border&height=200px)

![Task created](/peertube-plugin-livechat/images/task_from_message_3.png?classes=shadow,border&height=200px)

Using this feature, you can for example asks your moderators to note all chat questions, so you can see them at a glance during your live, and check them as your have answered.
