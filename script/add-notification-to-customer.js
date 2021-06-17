var { NotificationModel } = require('../dist/graphql/modules/notification/notification.model');
var { SendNotificationJob } = require('../dist/scheduler/jobs/sendNotification.job');

(async function() {
  const notify = new NotificationModel({
    target: "STAFF",
    type: "MESSAGE",
    staffId: "60c9a7ec88b7a43e5ab906fc",
    title: "TEST",
    body: "THong bao Test",
  });
  await notify.save();
  await SendNotificationJob.trigger();
  console.log("DONE");
  // process.exit();
})();