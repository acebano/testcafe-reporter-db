# testcafe-reporter-db
[![Build Status](https://travis-ci.org/acebano/testcafe-reporter-db.svg)](https://travis-ci.org/acebano/testcafe-reporter-db)
[![npm version](https://badge.fury.io/js/testcafe-reporter.db.svg)](https://badge.fury.io/js/testcafe-reporter-db)

This is the **db** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [DB Engines supported](#DB-Engines-supported)
* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Initial Configuration](#Initial-Configuration)
  * [Database Configuration](#Database-Configuration)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Author](#author)
* [Acknowledgements](#Acknowledgments)


## DB Engines supported

* MySQL


## Getting Started

### Installation


```
npm install testcafe-reporter-db
```

### Initial Configuration

In order to use the reporter correctly, you have to edit or create the .env file, by adding the following required **environment variables**:

Database connection details /play 56k
```
TESTCAFEREPORTER_DB_USERNAME=
TESTCAFEREPORTER_DB_PASS=
TESTCAFEREPORTER_DB_HOST=
```
Database and table details
```
TESTCAFEREPORTER_DB_DB=
TESTCAFEREPORTER_DB_RUN_RESULTS_TABLE=
TESTCAFEREPORTER_DB_TEST_TABLE=
```
Tescafe Reporter configuracion.
If you are interested in store each test result, you should use 1. If you are interested in store only failed results, the value should be 0.
```
TESTCAFEREPORTER_DB_TESTSTORED=
TESTCAFEREPORTER_DB_DEVICE=
TESTCAFEREPORTER_DB_BROWSER=
TESTCAFEREPORTER_DB_ENV=
TESTCAFEREPORTER_DB_OTHER_RUN=
TESTCAFEREPORTER_DB_OTHER_TEST=
```

### Database Configuration

* Run_results_table

Fields:

| Field  | Type | Lenght | Allow Null | Extra |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| id  | Int | 11 | No | auto_increment |
| date  | Datetime |  | No | auto_increment |
| run_number   | Int | 11 | No | None |
| run_result  | Varchar | 1 | No | None |
| test_total  | Int | 4 | No | None |
| test_passed  | Int | 4 | No | None |
| test_failed  | Int | 4 | No | None |
| test_skipped  | Int | 4 | No | None |
| test_duration  | Varchar | 10 | No | None |
| test_device  | Varchar | 50 | Yes | None |
| test_browser  | Varchar | 150 | Yes | None |
| test_environment  | Varchar | 50 | Yes | None |
| test_other_1  | Varchar | 50 | Yes | None |


- _run_result_ : 0 if the run passed. 1 if the run failed.

* Test_results_table

| Field  | Type | Lenght | Allow Null | Extra |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| id  | Int | 11 | No | auto_increment |
| run_number   | Int | 11 | No | None |
| fixture_name  | Varchar | 1000 | No | None |
| test_name | Varchar | 1000 | No | None |
| test_result  | Int | 1 | No | None |
| test_other  | Varchar | 100 | No | None |

- _test_result_ : 0 if the test passed. 1 if the test failed. 2 if the test was skipped


## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter db
```

When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('db') // <-
    .run();
```

## Roadmap



## Contributing

* If you want to suggest a change, feature or any question, feel free to open an issue or a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Author
* [Acebano :flower_playing_cards:](https://github.com/acebano)

+Based on [testcafe-reporter-list](https://github.com/DevExpress/testcafe-reporter-list)+

## Acknowledgments

* [AlexHoma](https://github.com/alexhoma)
* [MarioSanchez](https://github.com/mariosanchez) 

