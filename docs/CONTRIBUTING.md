# Contributing to Nano Canvas

First off, thank you for considering contributing to Nano Canvas! It's people like you that make open source such a great community.

We welcome any type of contribution, not just code. You can help with:

- **Reporting a bug**
- **Discussing the current state of the code**
- **Submitting a fix**
- **Proposing new features**
- **Becoming a maintainer**

## We Develop with GitHub

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure the test suite passes.
5.  Make sure your code lints.
6.  Issue that pull request!

## Any contributions you make will be under the AGPLv3

In short, when you submit code changes, your submissions are understood to be under the same [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/AUT-Valunex/nano-canvas/issues)

We use GitHub Issues to track public bugs. Report a bug by [opening a new issue](https://github.com/AUT-Valunex/nano-canvas/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Use a Consistent Coding Style

We use `prettier` and `eslint` to maintain a consistent code style. Please run `pnpm lint` and `pnpm format` before submitting a pull request.

- 2 spaces for indentation (not tabs)
- Single quotes for strings
- ...and more, all enforced by `.eslintrc.cjs` and `.prettierrc`.

## Development Setup

1.  Fork the repository and clone it to your local machine.
2.  Make sure you have Node.js version 18+ and `pnpm` installed.
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Start the development server:
    ```bash
    pnpm dev
    ```
5.  Open `http://localhost:5173` in your browser.

## Before You Push

- Run `pnpm lint` to ensure ESLint passes with zero warnings.
- Run `pnpm test` to execute the Vitest suite.
- Update the [CHANGELOG](CHANGELOG.md) when behaviour changes or new features land.
- Add screenshots or videos for visual tweaks to help reviewers.

## Security Reports

Found a vulnerability? Please follow the [Security Policy](SECURITY.md) and email `valunex@ik.me` instead of opening a public issue.

## Pull Requests

Our [PR template](.github/PULL_REQUEST_TEMPLATE.md) outlines what reviewers expect:

- Summarise the change and reference any issues (`Fixes #123`).
- Describe test coverage, including manual QA steps if applicable.
- Confirm accessibility for new UI states (keyboard navigation, screen readers).

We prefer small, focused PRs. If your change is large, consider breaking it into reviewable chunks or opening a tracking issue first.

## License

By contributing, you agree that your contributions will be licensed under the GNU AGPLv3 or any later version accepted by the project. Include `NOTICE.md` alongside any redistributed builds or forks.
