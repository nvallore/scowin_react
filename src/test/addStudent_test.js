var webdriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let options = new chrome.Options()
let nextPort = 9222
options.addArguments(["--remote-debugging-port=" + nextPort])

var browser= new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).setChromeOptions(options).build();
browser.get('http://localhost:3001/manageStudent');
const By = webdriver.By;
var x2 = browser.then(() => browser.findElement(By.css('#add-student')).click())
.then(() => browser.findElement(By.css('#student-name')).sendKeys('Jhanvi P'))
.then(() => browser.findElement(By.css('#student-id')).sendKeys('12345'))
.then(() => browser.findElement(By.css('#aadhar')).sendKeys('760900004564'))
.then(() => browser.findElement(By.css('#student-blood')).sendKeys('A+'))
.then(() => browser.findElement(By.css('#dob')).sendKeys('2014-07-16'))
.then(() => browser.findElement(By.css('#grade-1')).sendKeys('5'))
.then(() => browser.findElement(By.css('#section-1')).sendKeys('B'))
.then(() => browser.findElement(By.css('.gender-class')).sendKeys('Female'))
.then(() => browser.findElement(By.css('#existing')).sendKeys('Fever'))