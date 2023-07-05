+++
title="Translate"
description="Translate the plugin"
weight=20
chapter=false
+++

You can contribute to this plugin translation.
Translations are handled using the [Weblate](https://weblate.org/) software,
using [Framasoft Weblate instance](https://weblate.framasoft.org/).

{{% notice warning %}}
Never modify directly files in the `languages` folder, this could lead to conflicts.
{{% /notice %}}

## How to

* Create an account: https://weblate.framasoft.org/accounts/register/
* Validate your email and follow the link sent
* Create your password and setup your account
* Go to the plugin project page: https://weblate.framasoft.org/projects/peertube-livechat/peertube-plugin-livechat/
* Choose the locale you want to translate
* Just translate missing sentences, or correct the ones that seems incorrect to you.

{{% notice warning %}}
There might be some «very technical» strings. If you are not 100% sure of
the meaning, or of your translation, you better not translate it,
so it will display in english.
{{% /notice %}}

## Documentation translation

Fow now, this is not done on Weblate. I am still looking for the good technical solution.

Please refer to the "documentation" documentation page.

## Adding a new locale

If you think there is a missing locale, please check first if it is handled in Peertube.
If so, you can [open an issue](https://github.com/JohnXLivingston/peertube-plugin-livechat/issues) to ask for it.

## Adding new strings / use translations in the code

If you are working on new features, and need new strings, you can create them directly in Weblate.
The english version is mandatory. Start with it.

Each string is linked to a key (for example `use_chat`).
Choose an explicit key in english, lower case.

If you have to test new strings without waiting for a Weblate merge, you can modify `languages/*.yml` files,
but avoid to commit these changes (to minimize conflict risks).

### Use translations in front-end code

Before using a string in front-end, you need to declare a new constant in `client/@types/global.d.ts`.
The constant name must:

* start with the prefix "LOC_"
* use the string key, upper cased
* you just have to declare its type, not its value

For example, to use "use_chat", you have to declare:

```typescript
declare const LOC_USE_CHAT: string
```

The `build-client.js` script will read the `client/@types/global.d.ts`,
search for such constants, and load their values from the languages files.

Now, you can simply call `peertubeHelpers.translate(LOC_USE_CHAT)` in your code.

### Use translations in back-end code

In theory, the only parts of the backend code where you need localization is the
settings declaration and standardized data (ActivityPub, RSS, ...).
Here we need to get english strings from the translation key.

Note: you should never need another language translation from backend code.
Localization must be done on front-end.

There is a `lib/loc.ts` module providing a `loc()` function.
Just pass it the key to have the english string: `loc('diagnostic')`'.
