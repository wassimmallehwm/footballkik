'use strict';
module.exports = function(Users, async) {
    return {
        SetRouting : function(router) {
            router.get('/group/:name', this.groupPage);
            router.get('/logout', this.logout);
            
            router.post('/group/:name', this.groupPostPage);
            
        },

        groupPage : function(req, res){
            const name = req.params.name;

            async.parallel([
                function(callback){
                    Users.findOne({username: req.user.username})
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                const res1 = results[0];
                res.render('groupChat/group', {
                    title : 'Footballkik | Group',
                    user: req.user,
                    groupName: name,
                    data: res1
                });
            });
        },

        groupPostPage : function(req, res){
            async.parallel([
                function(callback){
                    if(req.body.receiver){
                        Users.updateOne({
                            'username' : req.body.receiver,
                            'request.userId' : {$ne: req.user._id},
                            'friendsList.friendId' : {$ne: req.user._id}
                        },{
                            $push: {request: {
                                userId : req.user._id,
                                username: req.user.username
                            }},
                            $inc: {totalRequest: 1}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK CONDITION 1');
                    }
                },

                function(callback){
                    if(req.body.receiver){
                        Users.updateOne({
                            'username' : req.user.username,
                            'sentRequest.username' : {$ne: req.body.receiver}
                        },{
                            $push: {sentRequest: {
                                username: req.body.receiver
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK CONDITION 2');
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+ req.params.name);
            });

            async.parallel([
                // update the receiver document when he accepts a friend request
                function(callback){
                    if(req.body.senderId){
                        Users.updateOne({
                            '_id' : req.user._id,
                            'friendsList.friendId' : {$ne: req.body.senderId}
                        },{
                            $push: {friendsList: {
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                            $pull: {request: {
                                userId: req.body.senderId,
                                username: req.body.senderName
                            }},
                            $inc: {totalRequest : -1}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK ACCEPT CONDITION 1');
                    }
                },

                // update the sender document when his friend request is accepted
                function(callback){
                    if(req.body.senderId){
                        Users.updateOne({
                            '_id' : req.body.senderId,
                            'friendsList.friendId' : {$ne: req.user._id}
                        },{
                            $push: {friendsList: {
                                friendId: req.user._id,
                                friendName: req.user.username
                            }},
                            $pull: {sentRequest: {
                                username: req.user.username
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK ACCEPT CONDITION 2');
                    }
                },

                
                // update the receiver document when he cancels a friend request
                function(callback){
                    if(req.body.cancelId){
                        Users.updateOne({
                            '_id' : req.user._id,
                            'request.userId' : {$eq: req.body.cancelId}
                        },{
                            $pull: {request: {
                                userId: req.body.cancelId
                            }},
                            $inc: {totalRequest : -1}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK ACCEPT CONDITION 1');
                    }
                },

                // update the sender document when his friend request is canceled
                function(callback){
                    if(req.body.cancelId){
                        Users.updateOne({
                            '_id' : req.body.cancelId,
                            'sentRequest.username' : {$ne: req.user.username}
                        },{
                            $pull: {sentRequest: {
                                username: req.user.username
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    } else {
                        console.log('CHECK ACCEPT CONDITION 2');
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+ req.params.name);
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
