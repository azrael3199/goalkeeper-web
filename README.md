# Goalkeeper (Web)
An interactive app to track your long term goals and habits for a better you (Web Version)

# Steps to run locally

```bash
$ git clone https://github.com/azrael3199/goalkeeper-web.git
$ cd goalkeeper-web
$ pnpm install
$ pnpm dev
```
- Follow the localhost link given in the terminal to the app on browser

# Current Roadmap

The Project is still in its infancy

To see our latest feature list and progress, checkout our [ROADMAP.md](https://github.com/azrael3199/goalkeeper-web/blob/main/docs/ROADMAP.md)

# Contributing

Fork the repository to your own Github ID and then clone it: https://docs.github.com/en/get-started/quickstart/fork-a-repo

## Conventions

### Branch Naming

There is no strict conventions for naming your branches, however some general rules need to be followed:

  - Your branch name should briefly describe what it intends to do

### Commit Messages

Commit messages must strictly follow the existing commitlint angular conventions given here: https://www.conventionalcommits.org/en/v1.0.0-beta.4/

Each commit message must start with a subject followed by the actual message that describes the tasks done in the commit.

In general, the subjects are:

- `build` OR `chore`: The build type (formerly known as chore) is used to identify development changes related to the build system (involving scripts, configurations or tools) and package dependencies.
- `ci`: The ci type is used to identify development changes related to the continuous integration and deployment system - involving scripts, configurations or tools.
- `docs`: The docs type is used to identify documentation changes related to the project - whether intended externally for the end users (in case of a library) or internally for the developers.
- `feat`: The feat type is used to identify production changes related to new backward-compatible abilities or functionality.
- `fix`: The fix type is used to identify production changes related to backward-compatible bug fixes.
- `perf`: The perf type is used to identify production changes related to backward-compatible performance improvements.
- `refactor`: The refactor type is used to identify development changes related to modifying the codebase, which neither adds a feature nor fixes a bug - such as removing redundant code, simplifying the code, renaming variables, etc.
- `style`: The style type is used to identify development changes related to styling the codebase, regardless of the meaning - such as indentations, semi-colons, quotes, trailing commas and so on.
- `test`: The test type is used to identify development changes related to tests - such as refactoring existing tests or adding new tests.
