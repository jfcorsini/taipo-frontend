<template>
  <div>
    <div id="local-media"></div>
    <div id="remote-media-div"></div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import { API, graphqlOperation } from "aws-amplify";
import { connect, createLocalVideoTrack } from 'twilio-video';

createLocalVideoTrack().then(track => {
  const localMediaContainer = document.getElementById('local-media');
  localMediaContainer.appendChild(track.attach());
});

const getTwilioToken = `query getTwilioToken($roomName: String!) {
  getTwilioToken(input: { roomName: $roomName }) {
    username
    token    
  }
}`;


export default {
  name: "home",

  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();

    const response = await API.graphql(
      graphqlOperation(getTwilioToken, { roomName: 'home' })
    );

    const { token, username } = response.data.getTwilioToken;
    console.log('Token', token);
    console.log('Username', username);

    connect(token, { name:'home', audio: true, video: { width: 640 } }).then(room => {
      console.log(`Successfully joined a Room: ${room}`);

      const localParticipant = room.localParticipant;
      console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);

      // Log any Participants already connected to the Room
      room.participants.forEach(participant => {
        console.log(`Participant "${participant.identity}" is connected to the Room`);
      });

      room.once('participantConnected', participant => {
        console.log(`Participant "${participant.identity}" has connected to the Room`);
      });

      room.once('participantDisconnected', participant => {
        console.log(`Participant "${participant.identity}" has disconnected from the Room`);
      })

      room.on('participantConnected', participant => {
        console.log(`Participant "${participant.identity}" connected`);

        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            const track = publication.track;
            document.getElementById('remote-media-div').appendChild(track.attach());
          }
        });

        participant.on('trackSubscribed', track => {
          document.getElementById('remote-media-div').appendChild(track.attach());
        });
      });

      room.on('participantDisconnected', participant => {
        console.log(`Participant disconnected: ${participant.identity}`);
      });
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
  }
};
</script>