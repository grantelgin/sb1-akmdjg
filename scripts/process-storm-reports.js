"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = require("dotenv");
var url_1 = require("url");
var path_1 = require("path");
var url_2 = require("url");
// Get the directory name of the current module
var __filename = (0, url_1.fileURLToPath)(new url_2.URL('', import.meta.url));
var __dirname = (0, path_1.dirname)(__filename);
// Load environment variables from .env file
dotenv.config({ path: (0, path_1.join)(__dirname, '../.env') });
var SUPABASE_URL = process.env.SUPABASE_URL;
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var supabase, clearError, _a, files, listError, reportFiles, results, _i, reportFiles_1, file, match, _, yy, mm, dd, date, response, result, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
                    // Clear existing records
                    console.log('Clearing existing storm reports...');
                    return [4 /*yield*/, supabase
                            .from('storm_reports')
                            .delete()
                            .neq('id', 0)]; // Delete all records
                case 1:
                    clearError = (_b.sent()) // Delete all records
                    .error;
                    if (clearError) {
                        console.error('Error clearing storm reports:', clearError);
                        return [2 /*return*/];
                    }
                    // List all files in the SPC bucket
                    console.log('Listing files in SPC bucket...');
                    return [4 /*yield*/, supabase
                            .storage
                            .from('spc')
                            .list()];
                case 2:
                    _a = _b.sent(), files = _a.data, listError = _a.error;
                    if (listError) {
                        console.error('Error listing files:', listError);
                        return [2 /*return*/];
                    }
                    reportFiles = (files === null || files === void 0 ? void 0 : files.filter(function (f) { return f.name.endsWith('_rpts.csv'); }).sort(function (a, b) { return a.name.localeCompare(b.name); })) || [];
                    console.log("Found ".concat(reportFiles.length, " report files"));
                    results = {
                        success: [],
                        failed: []
                    };
                    _i = 0, reportFiles_1 = reportFiles;
                    _b.label = 3;
                case 3:
                    if (!(_i < reportFiles_1.length)) return [3 /*break*/, 10];
                    file = reportFiles_1[_i];
                    match = file.name.match(/^(\d{2})(\d{2})(\d{2})_rpts\.csv$/);
                    if (!match)
                        return [3 /*break*/, 9];
                    _ = match[0], yy = match[1], mm = match[2], dd = match[3];
                    date = "20".concat(yy, "-").concat(mm, "-").concat(dd);
                    console.log("Processing ".concat(date, " (").concat(file.name, ")..."));
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, fetch('https://acltziqyxiugurpdduim.supabase.co/functions/v1/fetch-storm-reports', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(SUPABASE_SERVICE_ROLE_KEY)
                            },
                            body: JSON.stringify({ date: date })
                        })];
                case 5:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 6:
                    result = _b.sent();
                    if (result.success) {
                        console.log("\u2713 Successfully processed ".concat(date));
                        results.success.push(date);
                    }
                    else {
                        console.error("\u2717 Failed to process ".concat(date, ":"), result.error);
                        results.failed.push(date);
                    }
                    // Add a small delay between requests to avoid rate limiting
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 7:
                    // Add a small delay between requests to avoid rate limiting
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _b.sent();
                    console.error("\u2717 Error processing ".concat(date, ":"), error_1);
                    results.failed.push(date);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    // Print summary
                    console.log('\nProcessing complete!');
                    console.log("Successfully processed: ".concat(results.success.length, " dates"));
                    console.log("Failed to process: ".concat(results.failed.length, " dates"));
                    if (results.failed.length > 0) {
                        console.log('\nFailed dates:');
                        results.failed.forEach(function (date) { return console.log("- ".concat(date)); });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
