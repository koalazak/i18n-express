# i18n-middleware
A simple i18n middleware for Express.js
This module just reads all the <lang>.json files in a directory. Then calculates the user lang and exposes "texts" variables in your views with the texts in that json. 

## Requirements

  - Node >= 0.12
  - Express.js

## Usage

```js
var i18n=require("i18n-express");

app.use( i18n(options) );
```

### Options

- `translationsPath` : *(default: `i18n`)* The path where you store translations json files.
- `cookieLangName` : *(default: `ulang`)* If you provide a cookie name, try to get user lang from this cookie.
- `browserEnable` : *(default: `true`)* If enabled, try to get user lang from browser headers.
- `defaultLang` :  *(default: `en`)* If all others methods fail, use this lang.
- `paramLangName` :  *(default: `clang`)* Get param to change user lang. ej: visiting 'example.com?clang=es' the lang switchs to 'es'
- `siteLangs` :  *(default: `['en']`)* Array of supported langs. (posbile values for clang and json files)


### Example


 Create a directory "langs" with .json files for each lang. Ej:
 - en.json
 - es.json
 - en\-us.json
 
 With translations like this (en.json):

 ```json
 {
 "SOME_TEXT": "bla bla bla",
 "ANOTHER_BLA": "More bla"
 }
 ```
 

 In your Express app.js:

```javascript
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n=require("i18n-express"); // <-- require the module

var indexRoutes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en","es"]
}));
...

app.use('/', indexRoutes);

module.exports = app;

...

```

In your view:

```html
<div>

	<p><%=texts.SOME_TEXT%></p>

</div>
```

### License

MIT

### Author

  - [Facu ZAK](https://github.com/koalazak) 
