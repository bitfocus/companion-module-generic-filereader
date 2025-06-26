# companion-module-generic-filereader
See [HELP.md](./HELP.md) and [LICENSE](./LICENSE)

## Version History

### 2.2.1 (2025-06-26)
* Bugfix: Read File Now action was not updating the module variables
* Chore: Bump Companion-base to 1.4.3
* Chore: Bump Companion-tools to 1.5.1

### 2.2.0 (2025-05-22)
* Feature: Extend exist check to include if file is readable
* Change: Repeated file read interval now need to be at least 1000ms
* Bugfix: Rewrite all file handling functions to be async and handle returns properly
* Chore: Bump nanoid to 3.3.8
* Chore: Bump cross-span to 7.0.6
* Chore: Bump micromatch to 4.0.8
* Chore: Bump webpack to 5.94.0

### 2.1.0 (2024-08-23)
* Feature: Add feedback if file exists
* Chore: Bump tar to 6.2.1
* Chore: Bump braces to 3.0.3

### 2.0.1 (2023-07-22)
* Feature: Add read line action
* Chore: Bump word-wrap to 1.2.4
* Chore: Bump semver to 6.3.1

### 2.0.0 (2023-05-14)
* Major: Rewrite for Companion v3

### 1.0.0 (2022-11-12)
* Initial Release
