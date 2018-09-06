Template.studio.rendered = function() {
  Template.instance().studio = new Remon({
    config: {
      credential: Meteor.settings.public.remon.credential,
      view: {
        remote: "#studio"
      },
      media: {
        audio: true,
        video: {
          width: { max: "640", min: "320" },
          height: { max: "480", min: "240" },
          frameRate: 30
        },
      }
    },
    listener: {
      onCreate(chid) {
        console.log('streamId set', chid);
        Session.set("streamId", chid);
      }
    }
  });
};

Template.studio.events({
  'click #startBroadcast': function(event, template) {
    const cast = template.studio.createCast();
    console.log(cast);
    event.preventDefault();
  },
});