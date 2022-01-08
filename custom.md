This is a customized version of [Mastodon](https://github.com/mastodon/mastodon).

# Customizations

## Feat

### status-content-type-html

This customization allows user to choose html content or plain text when posting status.

| Latest Version | Branch                                 |
| -------------- | -------------------------------------- |
| v2.0.0         | `custom/feat/status-content-type-html` |

To apply this customization, after applying the changes with git,
**you must make a database migration**.

```sh
# if you are already based on `v3.4.4`
git merge custom/feat/status-content-type-html
# else
git cherry-pick f5067b5f6b8c219cd592385d5c0d0910510b61a0^..custom/feat/status-content-type-html

# after applying the changes, do a database migration
rails db:migrate
```

#### v2.0.0

This version use a more relaxed sanitizer to sanitize html status.

The new sanitizer config is `MASTODON_STATUS_HTML` defined in
[`lib/sanitize_ext/sanitize_config.rb`](lib/sanitize_ext/sanitize_config.rb),
which is based on
[`Sanitize::Config::RELAXED`](https://github.com/rgrove/sanitize/blob/main/lib/sanitize/config/relaxed.rb).

##### BREAKING CHANGES

- use a more relaxed html sanitizer based on [`Sanitize::Config::RELAXED`](https://github.com/rgrove/sanitize/blob/main/lib/sanitize/config/relaxed.rb)

#### v1.0.0

This version changes api `POST /api/v1/statuses`
to allow users to specify `content_type` attribute of the status.

`content_type` can be:

- `"text/html"`
- `"text/plain"`
- `null` or unset, equivalent to `"text/plain"`

##### Database Migration

- [`AddContentTypeToStatuses`](db/migrate/20211210194200_add_content_type_to_statuses.rb)

##### Compatibility

- Backward compatible for older frontend: when `content_type` is `null` or unset, `content_type` defaults to `text/plain`.
- Compatibility for other instances is currently untested and unknown

> This version borrows many code from [mashirozx/mastodon#229](https://github.com/mashirozx/mastodon/pull/229). Thanks for the work.

## Fix

## Chore

### dev-with-gitpod v1.0.0

This customization includes suitable configurations for development with [gitpod](https://gitpod.io/).

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/EqualMa/mastodon/tree/custom/stable)

Branch: `custom/chore/dev-with-gitpod`.

To apply, run:

```sh
git cherry-pick 74658b2a40abd55e810d49a675044ca58be0ffe6
```