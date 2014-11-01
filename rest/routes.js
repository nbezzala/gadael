'use strict';

/**
 * Object to create controller on request
 *
 * @param {restController} model    A rest controller class to use on request
 */
function ControllerFactory(model) {

    this.model = model;
    var factory = this;

    this.onRequest = function(req, res) {
        var actionController = new factory.model();
        actionController.onRequest(req, res);
    };
}



/**
 * Object to load controllers in a file
 * @param {object} app
 */
function fileControllers(app)
{
    this.app = app;
    
    /**
     * @param {string} path
     */
    this.add = function(path) {
    
        var controllers = require(path);

        for(var ctrlName in controllers) {
            if (controllers.hasOwnProperty(ctrlName)) {

                var controller = new ControllerFactory(controllers[ctrlName]);
                
                // instance used only to register method and path into the app
                var inst = new controller.model();
                
                app[inst.method](inst.path, controller.onRequest);
            }
        }
    };

}


/**
 * Load routes for the REST services
 * @param {express|object} app
 * @param {passport} passport
 */
exports = module.exports = function(app, passport)
{
    var controllers = new fileControllers(app);
    
    
	app.get('/rest/accounts', require('./Account').getAccounts);
	app.get('/rest/account', require('./Account').getAccount);
	app.get('/rest/common', require('./Common').getInfos);
	app.get('/rest/admin', require('./admin/index').getInfos);
	
    controllers.add('./admin/users');
    controllers.add('./admin/accountcollections');
    controllers.add('./admin/departments');
    controllers.add('./admin/collections');
    controllers.add('./admin/calendars');
    controllers.add('./admin/types');
    controllers.add('./admin/rights');
    controllers.add('./admin/rightrenewals');
    controllers.add('./admin/beneficiaries');
	
	app.post('/rest/login', require('./login').authenticate);
	app.post('/rest/login/forgot', require('./login').forgotPassword);
	app.post('/rest/login/reset', require('./login').resetPassword);
	app.get('/rest/logout', require('./logout').init);
	
	//social login
    /*
	app.get('/login/twitter/', passport.authenticate('twitter', { callbackURL: '#/login/twitter/callback/' }));
	app.get('/login/github/', passport.authenticate('github', { callbackURL: '#/login/github/callback/' }));
	app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '#/login/facebook/callback/' }));
	app.get('/login/google/', passport.authenticate('google', { callbackURL: '#/login/google/callback/', scope: ['profile email'] }));
	app.get('/login/tumblr/', passport.authenticate('tumblr', { callbackURL: '#/login/tumblr/callback/', scope: ['profile email'] }));
    */
    
	// tests
	app.get('/rest/populate', require('./tests/index').populate);
	
	

	//route not found
	app.all('*', require('./Common').http404);
};
