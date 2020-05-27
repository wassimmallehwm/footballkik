'use strict';
const path = require('path');
const fs = require('fs');

module.exports = function(formidable, Club) {
    return {
        SetRouting : function(router) {
            router.get('/dashboard', this.adminPage);


            router.post('/uploadFile', this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },

        adminPage : function(req, res) {
            return res.render('admin/dashboard');
        },

        adminPostPage : function(req, res) {
            Club.findOne({name : req.body.club}).then(function (result){
                if(!result){
                    console.log("NEW");
                    const newClub = new Club();
                    newClub.name = req.body.club;
                    newClub.country = req.body.country;
                    newClub.image = req.body.upload;
                    newClub.save((err) => {
                        res.render('admin/dashboard')
                    })
                } else {
                    console.log("SKIP");
                    res.render('admin/dashboard')
                }
            })
            
        },

        uploadFile: function(req, res){
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            form.parse(req);

            form.on('file', function(field, file) {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                    if (err) throw err;
                    console.log('File renamed successfully');
                })
            });
            form.on('error', (err) => {
                console.log(err);
            });
            form.on('end', () => {
                console.log('File uploaded successfully');
            });
        }
    }
}