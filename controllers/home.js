'use strict';

module.exports = function(async, Club, Users, _) {
    return {
        SetRouting : function(router) {
            router.get('/home', this.homePage);
            router.get('/logout', this.logout);

            router.post('/home', this.postHomePage);
            
        },


        homePage : function(req, res) {
            async.parallel([
                function(callback){
                    Club.find({}, (err, result) => {
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
                },
                function(callback){
                    Users.findOne({username: req.user.username})
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const dataChunk = [];
                const chunkSize = 3;
                
                for(let i = 0; i < res1.length; i+= chunkSize){
                    dataChunk.push(res1.slice(i, i + chunkSize));
                }
                const sortedCountries = _.sortBy(res2, '_id');
                res.render('home', {
                    title : 'Footballkik |Home',
                    user: req.user,
                    clubs: dataChunk,
                    countries: sortedCountries,
                    data: res3
                });
            })
        },

        postHomePage : function(req, res){

            async.parallel([

                function(callback){
                    Club.updateOne({
                        '_id' : req.body.id,
                        'fans.username' : {$ne : req.user.username}
                    },
                        {
                            $push : {fans: {
                                username: req.user.username,
                                email: req.user.email
                            }}
                        }, (err, count) => {
                            console.log('success', count);
                            callback(err, count);
                        }
                    )
                }
            ], (err, results) => {
                res.redirect('/home');
            });
        },

        logout : function(req, res){
            req.logout();
            req.session.destroy(err => {
                res.redirect('/');
            })
        }
    }
}
