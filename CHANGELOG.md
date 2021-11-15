# Changelog

## 2.0.0

- Adds `defaultValue` as the second argument to `generateContext`.
- Removes `options` object.
  - Because `defaultValue` is required ([which is the recommendation of the React team](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106)), there is no scenario where we can determine that a consumer of a Context was used outside of a parent Provider. Thus, there is no reason to `requireProvider` or have a custom error message when it is missing.
- Generics were swapped on `generateContext`. It is far more common to provide no `props` to a `Provider`. By ordering them as `generateContext<Context, Props>`, we enable omitting the `Props` generic entirely for most use cases.

## 1.0.1

- Changes check for `context` to only capture `undefined` values, not all falsy values

## 1.0.0

- Initial Release
