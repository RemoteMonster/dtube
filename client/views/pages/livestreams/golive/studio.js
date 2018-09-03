Template.studio.events({
  'click #startBroadcast': function(event) {
    const studio = new Remon({
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
      }
    });
    studio.createCast();
    event.preventDefault();
  },
});