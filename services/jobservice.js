/*job service - Weiping Huang */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var async = require("async");
var Job = require('../models/jobs');
var User = require('../models/hpuser');


module.exports = {
    fetchAllJobs: function(postal,user,pageNo,pageSize){
        var promise = Job.find({'Area.PostalCode':{$regex:postal}},null,{skip:(pageNo-1)*pageSize,limit:pageSize}).exec();
        return promise;
    },
    findById: function(id){
        var promise = Job.findById(id).exec();
        return promise;
    },
    updateJob: function (jobObj){
      return new Promise((resolve,reject) =>{
          this.findById(jobObj._id).then(
              function(job){
                var newJob = Object.assign(job,jobObj);
                var query = Job.findByIdAndUpdate(jobObj._id,jobObj);
                return query.exec();
              }
          ).catch(function(err){
              throw err;
          });
       });
    },
    saveJob: function(jobObj){
        var job = new Job(jobObj);
        var promise = job.save();
        return promise;
    },
    reportJob:function(jobId, user){
        return new Promise((resolve, reject) =>{
          this.findById(jobId)
            .then(function(job){
              job.ReportIt.push({Email: user.Email, Nickname: user.Nickname});
              job.save().then(function(obj){
                 resolve(obj);
              }).catch(function(err){
                 reject(err);
              });
            })
            .catch(function(err){
                reject(err);
            });
        });
    },
    likeJob:function(jobId, user){
        return new Promise((resolve, reject) =>{
           this.findById(jobId)
            .then(function(job){
              job.LikeIt.push({Email: user.Email, Nickname: user.Nickname});
              job.save().then(function(obj){
                 resolve(obj);
              }).catch(function(err){
                 reject(err);
              });
            })
            .catch(function(err){
                reject(err);
            });
        });
    },
    deleteJob: function(id){
       var promise = Job.remove({_id:id}).exec();
       return promise;
    }

}
