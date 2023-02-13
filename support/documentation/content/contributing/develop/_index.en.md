+++
title="Develop"
description="Develop"
weight=40
chapter=false
+++

Always talk about features you want to develop by creating/finding and commenting the issue tackling your problem
before you start working on it, and inform the community that you begin coding by claiming the issue.

Please use the `develop` branch. The `main` branch is reserved to released versions of the plugin, so that the documentation is always synchronized with the released version of the plugin.

Prerequisite for building this plugin:

- you must have `npm` installed
- you must have python venv installed (`python3-venv` package on Debian for example)

To clone the repository:

```bash
# Clone the repository
git clone https://github.com/JohnXLivingston/peertube-plugin-livechat.git
# Checkout the develop branch
git checkout develop
# Initialize the submodules. This command must be run again if any submodules' version changes.
git submodule update --init --recursive

# Install NPM dependencies and build the module for the first time:
npm install

# Build the plugin after a modification:
npm run build

# If you have a fork from the repository, add it as remote (example):
git remote add me git@github.com:MY_GITHUB_ACCOUNT/peertube-plugin-livechat.git

# Create a local branch for you developments, and checkout it (example):
git checkout my_development # Note: if an issue is associated, use fix_1234 as your branch name (where 1234 is the issue's number)
# To propose your modifications, push your branch to your repository (example):
git push --set-upstream me my_development
# Then go to your github repository with your web browser to propose the Pull Request (see additional instructions below)
```

Once you are ready to show your code to ask for feedback, submit a *draft* Pull Request.
Once you are ready for a code review before merge, submit a Pull Request. In any case, please
link your PR to the issues it solves by using the GitHub syntax: "fixes #issue_number".

The front-end code is in the `client` folder, the back-end code in `server`. There are some shared code in `shared` folder.

For general instructions (developping plugins, building, installation, ...), please refer to the [Peertube documentation](https://docs.joinpeertube.org/contribute-plugins?id=write-a-plugintheme).

You can build the plugin with extra debug features simply by using:

```bash
NODE_ENV=dev npm run build
```

## ESBuild vs Typescript

This plugin uses ESBuild for frontend code generation, as the official `peertube-plugin-quickstart` plugin.
ESBuild can handle Typescript, but does not check types
(see [ESBuild documentation](https://esbuild.github.io/content-types/#typescript)).
That's why we first compile Typescript with the `-noEmit` option, just to check types (`check:client:ts` in package.json file).
Then, if everything is okay, we run ESBuild to generate the compiled javascript.
