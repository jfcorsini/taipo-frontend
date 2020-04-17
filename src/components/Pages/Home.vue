<template>
  <div class="flex">
    <div id="local-media"></div>
    <div id="remote-media-div"></div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import { API, graphqlOperation } from "aws-amplify";
import { connect, createLocalVideoTrack } from 'twilio-video';

const getTwilioToken = `query getTwilioToken($roomName: String!) {
  getTwilioToken(input: { roomName: $roomName }) {
    username
    token    
  }
}`;

const connectParticipant = (participant) => {
  console.log('Participant "%s" connected', participant.identity);

  const div = document.createElement('div');
  div.id = participant.sid;
  div.innerText = participant.identity;

  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });

  document.getElementById('remote-media-div').appendChild(div);
}

const trackSubscribed = (div, track) => {
  div.appendChild(track.attach());
}

const trackUnsubscribed = (track) => {
  track.detach().forEach(element => element.remove());
}

const participantDisconnected = (participant) => {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

export default {
  name: "home",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();

    const response = await API.graphql(
      graphqlOperation(getTwilioToken, { roomName: 'home' })
    );

    const track = await createLocalVideoTrack();
    document.getElementById('local-media').appendChild(track.attach());

    const { token } = response.data.getTwilioToken;

    connect(token, { name:'home', audio: true, video: { width: 640 } }).then(room => {
      console.log(`Successfully joined a Room: ${room}`);

      const localParticipant = room.localParticipant;
      console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);

      room.participants.forEach(connectParticipant);
      room.on('participantConnected', connectParticipant);

      room.on('participantDisconnected', participantDisconnected);
      room.once('disconnected', () => room.participants.forEach(participantDisconnected));
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
  }
};
</script>