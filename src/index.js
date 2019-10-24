Object.defineProperty(exports, '__esModule', {
    value: true,
});
  
const mysql = require('mysql');


const createTestNumber =  Math.random().toString().slice(2, 11);
  
exports.default = function () {
    const conTests = mysql.createConnection({
        host:     process.env.TESTCAFEREPORTER_DB_HOST,
        user:     process.env.TESTCAFEREPORTER_DB_USERNAME,
        password: process.env.TESTCAFEREPORTER_DB_PASS,
        database: process.env.TESTCAFEREPORTER_DB_DB,
    });
    const util = require('util');

    const query = util.promisify(conTests.query).bind(conTests);

    conTests.connect((err) => {
        if (err) throw err;
    });
    return {
        noColors:           false,
        startTime:          null,
        afterErrList:       false,
        currentFixtureName: null,
        testCount:          0,
        skipped:            0,

        reportTaskStart: function reportTaskStart (startTime, userAgents, testCount) {
  
            this.startTime = startTime;
            this.testCount = testCount;

            this.setIndent(1)
                .useWordWrap(true)
                .write(this.chalk.bold('Running tests in:'))
                .newline();
  
            userAgents.forEach((ua) => {
                this.write(`- ${this.chalk.blue(ua)}`).newline();
        
            });

            this.setIndent(1)
                .useWordWrap(true)
                .write(this.chalk.bold(`Run id:  ${createTestNumber}`))
                .newline();
  
            this.newline();
        },
  
        reportFixtureStart: function reportFixtureStart (name) {
            this.currentFixtureName = name;
        },
  
        _renderErrors: function _renderErrors (errs) {
  
            this.setIndent(3).newline();
  
            errs.forEach((err, idx) => {
                const prefix = this.chalk.red(`${idx + 1}) `);
  
                this
                    .newline()
                    .write(this.formatError(err, prefix))
                    .newline()
                    .newline();
            });
        },
  
        reportTestDone: function reportTestDone (name, testRunInfo) {
            const hasErr = !!testRunInfo.errs.length;

            let symbol = null;

            let nameStyle = null;
  
            if (testRunInfo.skipped) {
                this.skipped++;
  
                symbol = this.chalk.cyan('-');
                nameStyle = this.chalk.cyan;
                testStatus = 2;
            }
            else if (hasErr) {
                symbol = this.chalk.red.bold(this.symbols.err);
                nameStyle = this.chalk.red.bold;
                testStatus = 1;
            }
            else {
                symbol = this.chalk.green(this.symbols.ok);
                nameStyle = this.chalk.grey;
                testStatus = 0;
            }
        
  
            let title = `${symbol} ${this.currentFixtureName} - ${name}`;
  
            if (testRunInfo.unstable) title += this.chalk.yellow(' (unstable)');
  
            if (testRunInfo.screenshotPath) title += ` (screenshots: ${this.chalk.grey.underline(testRunInfo.screenshotPath)})`;
  
            this.setIndent(1)
                .useWordWrap(true)
                .write(title);
  
            if (hasErr) this._renderErrors(testRunInfo.errs);
  
            this.afterErrList = hasErr;
  
            this.newline();
    
            if (process.env.TESTCAFEREPORTER_DB_TEST_STORED < 1) {
                const sql = `INSERT INTO ${process.env.TESTCAFEREPORTER_DB_TESTTABLE} (run_number, fixture_name, test_name, test_result, test_other) VALUES ?`;
                const values = [
                    [createTestNumber, this.currentFixtureName, name, testStatus, process.env.TESTCAFEREPORTER_DB_OTHER_TEST ],
                ];

                conTests.query(sql, [values], (err, result, fields) => {
                    if (err) throw err;
                });
            } 
        },
  
        _renderWarnings: function _renderWarnings (warnings) {
  
            this.newline()
                .setIndent(1)
                .write(this.chalk.bold.yellow(`Warnings (${warnings.length}):`))
                .newline();
  
            warnings.forEach((msg) => {
                this
                    .setIndent(1)
                    .write(this.chalk.bold.yellow('--'))
                    .newline()
                    .setIndent(2)
                    .write(msg)
                    .newline();
            });
        },
  
        reportTaskDone: function reportTaskDone (endTime, passed, warnings) {
            const durationMs = endTime - this.startTime;
            const durationStr = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');

        
            let footer = passed === this.testCount
                ? this.chalk.bold.green(`${this.testCount} passed`)
                : this.chalk.bold.red(`${this.testCount - passed}/${this.testCount} failed`);
  
            footer += this.chalk.gray(` (${durationStr})`);
  
            this.setIndent(1).useWordWrap(true);
  
            if (!this.afterErrList) this.newline();
  
            this.newline()
                .write(footer)
                .newline();
  
            if (this.skipped > 0) 
                this.write(this.chalk.cyan(`${this.skipped} skipped`)).newline();
        
  
            if (warnings.length) this._renderWarnings(warnings);
  
            this.setIndent(1)
                .useWordWrap(true)
                .write(this.chalk.bold(`Saving results in: ${process.env.TESTRESULT_LOCAL_HOST}`))
                .newline();

            const testResult = passed === this.testCount
                ? 0
                : 1;
  
            const sql = `INSERT INTO ${process.env.TESTCAFEREPORTER_DB_TABLE} (date, run_number, run_result, test_total, test_passed, test_failed, test_skipped, test_duration, test_device, test_environment, test_other_1) VALUES ?`;
            const values = [
                [endTime, createTestNumber, testResult, this.testCount, passed, this.testCount - passed, this.skipped, durationMs, process.env.TESTCAFEREPORTER_DB_DEVICE, process.env.TESTCAFEREPORTER_DB_ENV, process.env.TESTCAFEREPORTER_DB_OTHER_RUN ]
            ];

            conTests.query(sql, [values], (err, result, fields) => {
                if (err) throw err;
            });
        },
    };
};
  
module.exports = exports.default;
  
  
