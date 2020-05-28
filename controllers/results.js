'use strict';
module.exports = function(async, Club, _) {
    return {
        SetRouting : function(router) {
            router.get('/results', this.getResults);

            router.post('/results', this.postResults);
        },


        getResults : function(req, res){
            res.redirect('/home');
        },

        postResults : function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.country), 'gi');

                    Club.find({'$or' : [{country : regex}, {name : regex}]}, (err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    Club.aggregate([{
                        $group : {
                            _id : "$country"
                        }
                    }], (err, aggResult) => {
                        callback(err, aggResult);
                    })
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const dataChunk = [];
                const chunkSize = 3;
                
                for(let i = 0; i < res1.length; i+= chunkSize){
                    dataChunk.push(res1.slice(i, i + chunkSize));
                }
                const sortedCountries = _.sortBy(res2, '_id');
                res.render('results', {
                    title : 'Footballkik | Results',
                    user: req.user,
                    clubs: dataChunk,
                    countries: sortedCountries
                });
            })
        }
    }
}
