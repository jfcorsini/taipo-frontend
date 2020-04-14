<template>
  <div>
    <div id="local-media"></div>
    <div id="remote-media-div"></div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import { connect, createLocalVideoTrack } from 'twilio-video';
createLocalVideoTrack().then(track => {
  const localMediaContainer = document.getElementById('local-media');
  localMediaContainer.appendChild(track.attach());
});

const token = '';

connect(token, { name:'b24ad927-4c17-4a7c-9f12-1096456552a0' }).then(room => {
  console.log(`Successfully joined a Room: ${room}`);
  room.on('participantConnected', participant => {
    console.log(`A remote Participant connected: ${participant}`);
  });
}, error => {
  console.error(`Unable to connect to Room: ${error.message}`);
});

export default {
  name: "home",
};
</script>