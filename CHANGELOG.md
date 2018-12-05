# v2.0.0
## Change `mount` signature and only allow components with one-way bound props

Breaking:
* `mount` now takes a `tagName` as the first argument rather than a `template`
* only components with onw-way bound props are allowed (bear in mind that this affects all callbacks previously bound with `&`)

See [README](README.md#mounttagname-props-options--testelementwrapper).

# v1.2.2
## Expose `mock._template` and `mock._name` for custom matchers

These should be considered internals and are prone to change.

# v1.2.1
## Update view as part of `mock.simulate`

Previously, the `.simulate` call of `mock` did not update the view, requiring the test to inject `$scope` or `$rootScope` to `$apply` or `$digest` in order to test view changes.
This is now fixed and the fact that `.simulate` updates the view for both `mock` and `TestElementWrapper` is reflected in the documentation.

# v1.2.0
## Add `.first` to `TestElementWrapper`

See [README](README.md#first--testelementwrapper).

# v1.1.0
## Add `.at` to `TestElementWrapper`

See [README](README.md#atindex--testelementwrapper).

# v1.0.3
## Update Babel and Symbol polyfill

# v1.0.2
## Update dependencies

# v1.0.1
## Pass onAddItem as a one-way binding in example test

# v1.0.0
## Remove `options.mockComponents` from `mount`

The option caused errors not straightforward to fix due to an injector often already created before mounting.

# v0.3.0
## Add `options.mockComponents` to `mount`

See [README](README.md#mounttemplate-props-options--testelementwrapper).

# v0.2.1
## Fix readme

# v0.2.0
## Adds `mount`

See [README](README.md#mounttemplate-props--testelementwrapper).

# v0.1.1
## Publish dist/

# v0.1.0
## Adds `mockComponent`

See [README](README.md#api).
