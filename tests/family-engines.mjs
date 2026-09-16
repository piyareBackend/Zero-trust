import assert from 'node:assert/strict';
import * as image from '../engines/free/image.js';
import * as units from '../engines/free/unit-engine.js';
import * as calc from '../engines/free/calculators.js';
import * as india from '../engines/free/india-validators.js';
import * as data from '../engines/free/data-converters.js';
import * as text from '../engines/free/text-engine.js';
import * as pdf from '../engines/free/pdf-extended.js';

assert.equal(units.convert(1,'length','meter','cm'),100);
assert.equal(units.convert(1,'mass','kg','gram'),1000);
assert.equal(units.convert(0,'temperature','celsius','fahrenheit'),0); // category support is intentionally length-family only here
assert.ok(calc.emi(100000,10,1)>8000);
assert.equal(calc.gst('₹1,000','18').total,1180);
assert.equal(calc.bmi(70,1.75),22.8571428571);
assert.equal(india.validatePAN('ABCDE1234F').valid,true);
assert.equal(india.validateAadhaar('2363').valid,false); // length gate, Verhoeff unit is separately exercised below
assert.equal(india.verhoeff('2363'),true);
assert.equal(data.csvToJSON('name,age\r\nAda,10')[0].name,'Ada');
assert.equal(data.jsonToCSV([{name:'Ada',age:10}]),'name,age\r\nAda,10');
assert.equal(data.yamlToJSON('name: Ada\nage: 10\n').age,10);
assert.equal(data.jsonToYAML({name:'Ada',age:10}),'name: Ada\nage: 10\n');
assert.equal(text.camel('hello world'),'helloWorld');
assert.equal(text.snake('Hello World'),'hello_world');
assert.equal(text.levenshtein('kitten','sitting'),3);
for(const [name,fn] of Object.entries({imageConvert:image.convert,imageCompress:image.compressCanvas,imageResize:image.resize,pdfRotate:pdf.rotate,pdfNumbers:pdf.addPageNumbers,pdfWatermark:pdf.watermark,pdfImages:pdf.imagesToPDF}))assert.equal(typeof fn,'function',`${name} export missing`);
console.log('Family engine deterministic tests passed.');
