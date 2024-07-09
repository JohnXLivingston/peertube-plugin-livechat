---
title: "Tasks / To-do lists"
description: "You can handle tasks and task lists with your moderation team."
weight: 350
chapter: false
---

{{% notice info %}}
This feature comes with the livechat plugin version 10.0.0.
{{% /notice %}}

## Introduction

The livechat plugin includes a Task Application: a kind of "to-do list" feature where you can create task lists and add tasks to them.
Every room's admins have access to these tasks, so you can edit them collaboratively.

You can for example use the Task Application to:

* prepare a list of themes you want to discuss during your livestream, so you can be sure you won't forget anything
* highlight questions from your viewers, so you can come back to them later without forgetting to answer them
* ...

## Using the Task Application

### Opening the Task Application

To open the Task Application, there is a "{{% livechat_label "tasks" %}}" button in the top chat menu:

![Opening the Task Application](/peertube-plugin-livechat/images/task_open_app_video.png?classes=shadow,border&height=200px)

![Opening the Task Application](/peertube-plugin-livechat/images/task_open_app_fullpage.png?classes=shadow,border&height=200px)

Clicking this button will toggle the Task Application display:

![Task Application](/peertube-plugin-livechat/images/task_app_video_1.png?classes=shadow,border&height=200px)

![Task Application](/peertube-plugin-livechat/images/task_app_fullpage_1.png?classes=shadow,border&height=200px)

{{% notice tip %}}
To have more space and better readability, open the chat in full-page mode.
{{% /notice %}}

### Access rights

Every room's admins have access to the Task Application (read and write access).

When you promote someone as room admin or owner, they gets instant access to the Task Application.
When you remove admin or owner rights to someone, they instantly lose access to the Task Application.

### Task lists

By default, there is one task list that has the same name as your livestream.

You can use the form at the bottom to create a new task list.
You can also edit existing task lists using the edit button, or delete any task list. Deleting a task list will also delete all its tasks.

Task lists are sorted alphabetically.

![Task lists](/peertube-plugin-livechat/images/task_app_task_lists.png?classes=shadow,border&height=200px)

{{% notice tip %}}
All modification are instantly visible in all your browser tabs, and for all room's admins.
{{% /notice %}}

### Tasks

#### Create tasks

You can create a task using the button on the right of task lists.
This opens a form with two fields: a mandatory task name, and an optional description.

![Task form](/peertube-plugin-livechat/images/task_app_task_form.png?classes=shadow,border&height=200px)

![Task created](/peertube-plugin-livechat/images/task_app_task_1.png?classes=shadow,border&height=200px)

#### Edit tasks

Tasks can be edited by using the edit button on the right.

Tasks can be marked complete (or uncomplete) by clicking directly on the checkbox in the list.

![Tasks](/peertube-plugin-livechat/images/task_app_task_2.png?classes=shadow,border&height=200px)

#### Sorting tasks / change task list

You can sort tasks, or move tasks from one list to another, simply using drag & drop.

![Drag and drop to sort](/peertube-plugin-livechat/images/task_drag_drop.png?classes=shadow,border&height=200px)

![Drag and drop to move to another list](/peertube-plugin-livechat/images/task_drag_drop_task_list.png?classes=shadow,border&height=200px)

#### Create a task from a chat message

You can create a task from a message in a chat, using the "{{% livechat_label "task_create" %}}" button in the dropdown menu at the right of the message.
This will open a dialog box where you can choose which task list you want to add the task into.
The task name will be the user nickname, and the task description the message content.

![Create task from message](/peertube-plugin-livechat/images/task_from_message_1.png?classes=shadow,border&height=200px)

![Choose the task list](/peertube-plugin-livechat/images/task_from_message_2.png?classes=shadow,border&height=200px)

![Task created](/peertube-plugin-livechat/images/task_from_message_3.png?classes=shadow,border&height=200px)

Using this feature, for example, you can ask your moderators to highlight all chat questions, so you can see them at a glance during your livestream, and check them as answered.
