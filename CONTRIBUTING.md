# Welcome to the contributing guide for the plugin peertube-plugin-livechat

Interested in contributing? Awesome!

## Code of conduct

Please read the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

## Translate

You can help us to translate this PeerTube plugin by creating or modifying translation files in the `languages` folder.

Please work on the `develop` branch, and do your commits and pull request on this branch.

If the language you are interesting in does not exist yet, create a file `code.json` in the `languages` folder, where `code` is the language code.
The language code must be the same as the Peertube's langage code (see [Peertube documentation](https://github.com/Chocobozzz/PeerTube/blob/develop/support/doc/translation.md)).
Then add the language file in the [package.json](package.json) file, under the key `translations`.

Translation strings are set in the language file as follow:

- files are in [JSON format](https://www.json.org)
- the JSON key is the english string (see existing keys in the [french translation file](languages/fr.json)).
- the JSON value is the translating string
- NB: there is no english translation file (this is how translation works for peertube's plugins)

## Give your feedback

You don't need to know how to code to start contributing to this plugin! Other
contributions are very valuable too, among which: you can test the software and
report bugs, you can give feedback, features that you are
interested in, user interface, design, ...

## Develop

Always talk about features you want to develop by creating/finding and commenting the issue tackling your problem
before you start working on it, and inform the community that you begin coding by claiming the issue.

Please use the `develop` branch. The `main` branch is reserved to released versions of the plugin, so that the documentation is always synchronized with the released version of the plugin.

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
