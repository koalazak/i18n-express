/* global describe it */
var assert = require('assert');
var path = require('path');

var i18nmod = require('..');
var res = {};

function getExpressReq (headerLang, session, query) {
  headerLang = headerLang || {};
  session = session || {};
  query = query || {};

  return {
    session: session,
    cookies: {},
    query: query,
    headers: headerLang,
    app: { locals: {} }
  };
}

describe('i18n-express', function () {
  describe('middleware', function () {
    it('should set \'texts\' to a desired variable', function (done) {
      var req = getExpressReq();

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es'],
        textsVarName: 'testVar'
      });

      mws(req, res, function () {
        assert.equal('testVar', req.app.locals.textsVarName);
        done();
      });
    });

    it('should set default language', function (done) {
      var req = getExpressReq();

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es']
      });

      mws(req, res, function () {
        assert.equal('en', req.app.locals.lang);
        assert.equal('English', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should set user defined default language', function (done) {
      var req = getExpressReq();

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es'],
        defaultLang: 'es'
      });

      mws(req, res, function () {
        assert.equal('es', req.app.locals.lang);
        assert.equal('Spanish', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should use browser language', function (done) {
      var req = getExpressReq({ 'accept-language': 'es-AR,en;q=0.8,pt;q=0.6' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es']
      });

      mws(req, res, function () {
        assert.equal('es', req.app.locals.lang);
        assert.equal('Spanish', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('shouldn\'t use browser language beacuase is disabled', function (done) {
      var req = getExpressReq({ 'accept-language': 'es-AR,en;q=0.8,pt;q=0.6' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es'],
        browserEnable: false
      });

      mws(req, res, function () {
        assert.equal('en', req.app.locals.lang);
        assert.equal('English', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should use session/cookie stored language', function (done) {
      var req = getExpressReq({ 'accept-language': 'es-AR,en;q=0.8,pt;q=0.6' }, { 'ulang': 'pt' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es', 'pt'],
        browserEnable: false
      });

      mws(req, res, function () {
        assert.equal('pt', req.app.locals.lang);
        assert.equal('Portuges', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should not use session/cookie stored language if translations doesn\'t exist', function (done) {
      var req = getExpressReq({ 'accept-language': 'es-AR,en;q=0.8,pt;q=0.6' }, { 'ulang': 'it' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es', 'pt', 'it'],
        browserEnable: false
      });

      mws(req, res, function () {
        assert.equal('en', req.app.locals.lang);
        assert.equal('English', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should change language using get query and store the new value', function (done) {
      var req = getExpressReq({ 'accept-language': 'es-AR,en;q=0.8,pt;q=0.6' }, {}, { 'clang': 'pt' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es', 'pt']
      });

      mws(req, res, function () {
        assert.equal('pt', req.session.ulang);
        assert.equal('pt', req.app.locals.lang);
        assert.equal('Portuges', req.app.locals.texts.TRANSLATION);
        done();
      });
    });

    it('should use specific language by country', function (done) {
      var req = getExpressReq({ 'accept-language': 'en-US,en;q=0.8,pt;q=0.6' });

      var mws = i18nmod({
        translationsPath: path.join(__dirname, 'translations'),
        siteLangs: ['en', 'es', 'en-us']
      });

      mws(req, res, function () {
        assert.equal('en-us', req.app.locals.lang);
        assert.equal('English US', req.app.locals.texts.TRANSLATION);
        done();
      });
    });
  });
});
