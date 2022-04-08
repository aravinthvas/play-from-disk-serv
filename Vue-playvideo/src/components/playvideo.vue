<template>
    <v-app>
      <v-container>
       <v-col cols="6">
        <video 
        id="remoteVideos" 
        autoplay 
        controls
         muted 
         style="width:600px">
         </video>
       </v-col>
    </v-container> 
   </v-app>
</template>
<script>
import axios from 'axios'

export default {
  name: "App",
  data() {
    return {
      
    };
  },
  mounted () {
         this.getSdptoken()
       },
  methods: {
    async getSdptoken() {
          let pc = new RTCPeerConnection({
            iceServers: [
              {
                urls: 'stun:stun.l.google.com:19302'
              }
            ]
          })
          try {
            pc.oniceconnectionstatechange
          } catch (e) {
            alert(e)
          }
    
         pc.onicecandidate = event => {
             console.log(Buffer.from(JSON.stringify(pc.localDescription)).toString('base64'));
             console.log(event);
          }
          pc.ontrack = function (event) {
            var el = document.createElement(event.track.kind)
            el.srcObject = event.streams[0]
            el.autoplay = true
            el.controls = true
            document.getElementById('remoteVideos').appendChild(el)
          }

          // Offer to receive 1 audio, and 1 video track
          pc.addTransceiver('video', {'direction': 'sendrecv'})
          pc.addTransceiver('audio', {'direction': 'sendrecv'})

          let offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          let sd = Buffer.from(JSON.stringify(pc.localDescription)).toString('base64');
         
            const param = new URLSearchParams()
            param.append('data', sd)
              axios.post("http://localhost:8080/streamer/receiver/test",param,{ headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
               .then(response => {
                  pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(Buffer.from(response.data, 'base64').toString('ascii'))))
                 })
       },
  },
      
};
</script>