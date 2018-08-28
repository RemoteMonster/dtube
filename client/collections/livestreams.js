import Remon from '@remotemonster/sdk';

LiveStats = new Mongo.Collection(null)
Livestreams = new Mongo.Collection(null)
var streamingApi = 'https://stream.dtube.top:3000'

Livestreams.getStreamKey = function(cb) {
    var username = Session.get('activeUsername')
    var xhr = new XMLHttpRequest();
    xhr.open('GET', streamingApi+'/resetKey/'+username, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var keyRequest = JSON.parse(xhr.responseText)
                broadcast.streamVerif(keyRequest.verifKey, function(err, res) {
                    if (err) {
                        cb(err)
                        return
                    }
                    Livestreams.verifyKey(res.block_num, res.trx_num, function(err) {
                        if (err) cb(err)
                        else cb(null, keyRequest.streamKey)
                    })
                })
            } else {
              cb("API not responding!");
            }
        }
    }
}

Livestreams.verifyKey = function(block, tx_num, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', streamingApi+'/verify/'+block+'/'+tx_num, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (xhr.responseText == 'Ok')
                    cb()
                else
                    cb('Could not verify key')
            } else {
              cb("API not responding!");
            }
        }
    }
}

Livestreams.getStreams = function(cb) {
  const callsFetcher = new Remon({
    config: {
      credential: Meteor.settings.public.remon.credential
    }
  });

  callsFetcher.fetchCasts()
    .then(results=>{
      const ids = results.map(o=>o.id);
      LiveStats.find().map(o=>o.id)
        .filter(o=>ids.every(p=>o!==p))
        .some(o=>LiveStats.remove({id: o}));
      results.some(o=>{
        LiveStats.upsert({_id: o.id}, {
          viewer: 0,
          duration: 99999999
        })
      })
    });

  // var xhr = new XMLHttpRequest();
  //   xhr.open('GET', streamingApi+'/getStreams', true);
  //   xhr.send();
  //   xhr.onreadystatechange = function () {
  //       if (xhr.readyState == 4) {
  //           if (xhr.status == 200) {
  //               if (!xhr.responseText || xhr.responseText.length == 0) {
  //                   cb(null)
  //                   return
  //               }
  //               var streams = JSON.parse(xhr.responseText)
  //               for (var key in streams) {
  //                   var stream = {
  //                       _id: key.replace('normal+',''),
  //                       viewers: streams[key][0],
  //                       duration: streams[key][1]
  //                   }
  //                   LiveStats.upsert({_id: stream._id}, stream)
  //               }
  //               cb(null)
  //           } else {
  //             cb("API not responding!");
  //           }
  //       }
  //   }
}

Livestreams.getStreamsByCreated = function(limit, cb) {
  const callsFetcher = new Remon({
    config: {
      credential: Meteor.settings.public.remon.credential
    }
  });

  callsFetcher.fetchCasts()
    .then(results=>{
      const ids = results.map(o=>o.id);
      Livestreams.find().map(o=>o.id)
        .filter(o=>ids.every(p=>o!==p))
        .some(o=>Livestreams.remove({id: o}));
      results.some(o=>{
        Livestreams.upsert({_id: o.id}, {
          active_votes: [],
          author: o.id,
          body: "<",
          content: {
            description: "boooring",
            tags: ["dev"],
            created: (new Date()).toISOString(),
            curator_payout_value: "0.000 SBD",
          },
          info: {
            author: o.id,
            livestream: true,
            permlink: "1111111",
            snaphasH: "QmVqhhNGPTJFb1MrrXAkhLtaw8ATJnx3zAVXnJTPifsbW2",
            title: o.id,
          },
          net_rshare: 0,
          pending_payout_value: "0.000 SBD",
          permlink: "1111111",
          reblogged_by: [],
          source: "chainByCreated",
          total_payout_value: "0.000 SBD"
        });
      });
      cb(null);
    });
    //
    // var query = {
    //   "tag": "dtv",
    //   "limit": Session.get('remoteSettings').loadLimit,
    //   "truncate_body": 1
    // }
    //
    // if (limit) query.limit = limit
    // if (Session.get('oldestStream')) {
    //     query.start_author = Session.get('oldestStream').author
    //     query.start_permlink = Session.get('oldestStream').permlink
    // }
    //
    // steem.api.getDiscussionsByCreated(query, function(err, result) {
    //     Session.set('oldestStream', result[result.length-1])
    //     if (err === null || err === '') {
    //         var i, len = result.length;
    //         var videos = []
    //         for (i = 0; i < len; i++) {
    //             var video = Videos.parseFromChain(result[i])
    //             if (video) videos.push(video)
    //         }
    //         for (var i = 0; i < videos.length; i++) {
    //             videos[i].source = 'chainByCreated'
    //             try {
    //                 Livestreams.upsert({_id: videos[i]._id}, videos[i])
    //             } catch(err) {
    //                 console.log(err)
    //                 cb(err)
    //             }
    //         }
    //         cb(null)
    //     } else {
    //         console.log(err);
    //         cb(err)
    //     }
    // });
}

Livestreams.getStreamsByHot = function(limit, cb) {
    // var query = {
    //   "tag": "dtv",
    //   "limit": Session.get('remoteSettings').loadLimit,
    //   "truncate_body": 1
    // }
    //
    // if (limit) query.limit = limit
    // if (Session.get('oldestHotStream')) {
    //     query.start_author = Session.get('oldestHotStream').author
    //     query.start_permlink = Session.get('oldestHotStream').permlink
    // }
    //
    // steem.api.getDiscussionsByHot(query, function(err, result) {
    //     Session.set('oldestHotStream', result[result.length-1])
    //     if (err === null || err === '') {
    //         var i, len = result.length;
    //         var videos = []
    //         for (i = 0; i < len; i++) {
    //             var video = Videos.parseFromChain(result[i])
    //             if (video) videos.push(video)
    //         }
    //         for (var i = 0; i < videos.length; i++) {
    //             videos[i].source = 'chainByHot'
    //             try {
    //                 Livestreams.upsert({_id: videos[i]._id}, videos[i])
    //             } catch(err) {
    //                 console.log(err)
    //                 cb(err)
    //             }
    //         }
    //         cb(null)
    //     } else {
    //         console.log(err);
    //         cb(err)
    //     }
    // });
}