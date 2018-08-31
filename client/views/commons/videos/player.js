import Remon from "@remotemonster/sdk";
window.Remon = Remon;

Template.player.rendered = function () {
  Template.player.init()
}

// change this url if you want to work with your own branch of the player
Template.player.init = function() {
  // $('.ui.embed.player').embed({
  //   url: "https://emb.d.tube/#!/" + FlowRouter.getParam("author") + "/" + FlowRouter.getParam("permlink") + "/true/true"
  // });

  // connect video
  const viewer = new Remon({
    config: {
      credential: Meteor.settings.public.remon.credential,
      view: {
        remote: "#viewer"
      },
      media: {
        audio: true,
        video: {
          width: { max: "640", min: "320" },
          height: { max: "480", min: "240" },
          frameRate: 30
        },
        recvonly: true
      }
    }
  });
  viewer.joinCast(FlowRouter.getParam("permlink"));
}