'use strict';


exports = module.exports = function(services, app) {
    
    var service = new services.delete(app);
    
    /**
     * Call the calendar delete service
     * 
     * @param {object} params
     * @return {Promise}
     */
    service.call = function(params) {
        
        
        service.models.Calendar.findById(params.id, function (err, document) {
            if (service.handleMongoError(err)) {
                document.remove(function(err) {
                    if (service.handleMongoError(err)) {
                        service.success(service.gt.gettext('The calendar has been deleted'));
                        
                        var calendar = document.toObject();
                        calendar.$outcome = service.outcome;
                        
                        service.deferred.resolve(calendar);
                    }
                });
            }
        });
        
        return service.deferred.promise;
    };
    
    
    return service;
};

