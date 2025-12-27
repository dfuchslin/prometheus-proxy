import WebSocket, { type RawData } from 'ws';
import { config } from '../config.js';
import logger from '../lib/logger.js';
import {
  audioAmplifierFan,
  audioAmplifierPower,
  audioAmplifierTemperature,
  audioAmplifierVolume,
} from '../services/metrics.js';

let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export const connect = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  const url = `ws://${config.nad.host}:${config.nad.port}/`;
  logger.info(`Connecting to WebSocket: ${url}`);
  ws = new WebSocket(url);

  ws.on('open', function open() {
    logger.info('WebSocket connected');
    ws?.send('Main.Model?');
    // gets complete state
    ws?.send('Main?');
  });

  ws.on('message', function message(data) {
    processMessage(data);
  });

  ws.on('error', function error(err) {
    logger.error(`WebSocket error: ${err.message}`);
  });

  ws.on('close', function close() {
    logger.info('WebSocket connection closed. Reconnecting in 5 seconds...');
    ws = null;
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, 5000);
    }
  });
};

const processMessage = (rawData: RawData) => {
  if (!(rawData instanceof Buffer)) {
    logger.warn(`WebSocket processMessage couldn't handle data type: ${JSON.stringify(rawData)}`);
    return;
  }

  const data = rawData.toString().replace(/\r/g, '').replace(/\n/g, '');
  logger.debug(`WebSocket received: ${data}`);

  const id = config.nad.name;
  const [ key, value ] = data.split('=');

  if (key.startsWith('Main.Temp.')) {
    const location = key.toLowerCase().split('.')[2]
    audioAmplifierTemperature.labels({ id, location }).set(toNumber(value));
  }

  if (key === 'Main.Fan.Status') {
    // Main.Fan.Status=1300,1300,OK
    // requested, actual, status
    const [requested, actual, _] = value.split(',');
    audioAmplifierFan.labels({ id, type: 'requested' }).set(toNumber(requested));
    audioAmplifierFan.labels({ id, type: 'actual' }).set(toNumber(actual));
  }
  if (key === 'Main.Power') {
    const power = value === 'On' ? 1 : value === 'Off' ? 0 : undefined;
    if (power !== undefined) {
      audioAmplifierPower.labels({ id }).set(power);
    } else {
      logger.warn(`WebSocket received unknown power value ${key}=${value}`);
    }
  }

  if (key === 'Main.Volume') {
    audioAmplifierVolume.labels({ id }).set(toNumber(value));
  }
}

const toNumber = (value: string) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}


/*
● WebSocket received: Main.Model=T778
● WebSocket received: Main.Action=MenuClose
● WebSocket received: Main.Amp.Back=Back
● WebSocket received: Main.Amp.Clip=No
● WebSocket received: Main.Amp.Overheat=No
● WebSocket received: Main.Audio.CODEC=PCM
● WebSocket received: Main.Audio.Channels=3/2.1
● WebSocket received: Main.Audio.Delay=36.7
● WebSocket received: Main.Audio.Lock=Yes
● WebSocket received: Main.Audio.Rate=48
● WebSocket received: Main.Audyssey=Off
● WebSocket received: Main.Audyssey.ADV=Off
● WebSocket received: Main.Audyssey.DEQ=Off
● WebSocket received: Main.Audyssey.Offset=0
● WebSocket received: Main.AutoStandby=Off
● WebSocket received: Main.AutoTrigger=Main
● WebSocket received: Main.Bass=0
● WebSocket received: Main.Brightness=1
● WebSocket received: Main.Build=T778_PG536M_NONE
● WebSocket received: Main.CEC.ARC=Auto
● WebSocket received: Main.CEC.Audio=On
● WebSocket received: Main.CEC.Power=On
● WebSocket received: Main.CEC.Switch=On
● WebSocket received: Main.CenterDialog=0
● WebSocket received: Main.ControlStandby=On
● WebSocket received: Main.DTS.CenterGain=0.2
● WebSocket received: Main.DTS.DRC=100
● WebSocket received: Main.DTS.DialogControl=0
● WebSocket received: Main.Dirac=3
● WebSocket received: Main.Distance.BackLeft=0
● WebSocket received: Main.Distance.BackRight=0
● WebSocket received: Main.Distance.Center=0
● WebSocket received: Main.Distance.Left=0
● WebSocket received: Main.Distance.Right=0
● WebSocket received: Main.Distance.Sub=0
● WebSocket received: Main.Distance.SurroundLeft=0
● WebSocket received: Main.Distance.SurroundRight=0
● WebSocket received: Main.Distance.UOM=Feet
● WebSocket received: Main.Distance.User1Left=0
● WebSocket received: Main.Distance.User1Right=0
● WebSocket received: Main.Distance.User2Left=0
● WebSocket received: Main.Distance.User2Right=0
● WebSocket received: Main.Dolby.CenterSpread=On
● WebSocket received: Main.Dolby.CenterWidth=3
● WebSocket received: Main.Dolby.DRC=Auto
● WebSocket received: Main.Dolby.Dimension=0
● WebSocket received: Main.Dolby.Panorama=Off
● WebSocket received: Main.EnhancedBass=On
● WebSocket received: Main.EnhancedStereo.Back=On
● WebSocket received: Main.EnhancedStereo.Center=On
● WebSocket received: Main.EnhancedStereo.Front=On
● WebSocket received: Main.EnhancedStereo.Surround=On
● WebSocket received: Main.EnhancedStereo.User1=On
● WebSocket received: Main.EnhancedStereo.User2=On
● WebSocket received: Main.Fan.Status=1000,1000,OK
● WebSocket received: Main.Fan.Test=Off
● WebSocket received: Main.IR.Channel=0
● WebSocket received: Main.LCD.DarkMode=On
● WebSocket received: Main.LCD.Display=Temp
● WebSocket received: Main.LCD.FrontView.BluOS=6
● WebSocket received: Main.LCD.FrontView.Other=1
● WebSocket received: Main.Language=en-US
● WebSocket received: Main.Level.BackLeft=0
● WebSocket received: Main.Level.BackRight=0
● WebSocket received: Main.Level.Center=0
● WebSocket received: Main.Level.Left=0
● WebSocket received: Main.Level.Right=0
● WebSocket received: Main.Level.Sub=0
● WebSocket received: Main.Level.SurroundLeft=0
● WebSocket received: Main.Level.SurroundRight=0
● WebSocket received: Main.Level.User1Left=0
● WebSocket received: Main.Level.User1Right=0
● WebSocket received: Main.Level.User2Left=0
● WebSocket received: Main.Level.User2Right=0
● WebSocket received: Main.LipSyncDelay=0
● WebSocket received: Main.ListeningMode=None
● WebSocket received: Main.ListeningMode.Analog=None
● WebSocket received: Main.ListeningMode.DTS.Stereo=NeuralX
● WebSocket received: Main.ListeningMode.DTS.Surround=NeuralX
● WebSocket received: Main.ListeningMode.Dolby.Stereo=None
● WebSocket received: Main.ListeningMode.Dolby.Surround=None
● WebSocket received: Main.ListeningMode.PCM.Stereo=None
● WebSocket received: Main.ListeningMode.PCM.Surround=None
● WebSocket received: Main.Model=T778
● WebSocket received: Main.Mute=Off
● WebSocket received: Main.OSD.TempDisplay=On
● WebSocket received: Main.Power=Off
● WebSocket received: Main.Serial=K226T77809841
● WebSocket received: Main.Sleep=0
● WebSocket received: Main.Source=1
● WebSocket received: Main.Speaker.Back.Config=Off
● WebSocket received: Main.Speaker.Back.Frequency=80
● WebSocket received: Main.Speaker.Back.Mode=Stereo
● WebSocket received: Main.Speaker.Center.Config=Large
● WebSocket received: Main.Speaker.Center.Frequency=80
● WebSocket received: Main.Speaker.Front.Config=Large
● WebSocket received: Main.Speaker.Front.Frequency=80
● WebSocket received: Main.Speaker.Sub=On
● WebSocket received: Main.Speaker.Surround.Config=Small
● WebSocket received: Main.Speaker.Surround.Frequency=80
● WebSocket received: Main.Speaker.User1.Config=Small
● WebSocket received: Main.Speaker.User1.Frequency=80
● WebSocket received: Main.Speaker.User1.Mode=DolbyFront
● WebSocket received: Main.Speaker.User2.Config=Off
● WebSocket received: Main.Speaker.User2.Frequency=80
● WebSocket received: Main.Speaker.User2.Mode=DolbyFront
● WebSocket received: Main.Temp.Back=54
● WebSocket received: Main.Temp.Center=48
● WebSocket received: Main.Temp.Front=48
● WebSocket received: Main.Temp.Height=51
● WebSocket received: Main.Temp.PSU=55
● WebSocket received: Main.Temp.Surround=50
● WebSocket received: Main.ToneDefeat=Off
● WebSocket received: Main.Treble=0
● WebSocket received: Main.Trigger1.Delay=0
● WebSocket received: Main.Trigger1.Out=Main
● WebSocket received: Main.Trigger2.Delay=0
● WebSocket received: Main.Trigger2.Out=Zone2
● WebSocket received: Main.Trigger3.Delay=0
● WebSocket received: Main.Trigger3.Out=Source
● WebSocket received: Main.Trim.Center=0
● WebSocket received: Main.Trim.Height=0
● WebSocket received: Main.Trim.Sub=0
● WebSocket received: Main.Trim.Surround=0
● WebSocket received: Main.Version=v2.24
● WebSocket received: Main.Video.3D=No
● WebSocket received: Main.Video.ARC=No
● WebSocket received: Main.Video.Bits=24
● WebSocket received: Main.Video.Color=RGB 4:4:4
● WebSocket received: Main.Video.HDR=No
● WebSocket received: Main.Video.Lock=Yes
● WebSocket received: Main.Video.Resolution=3840x2160p60
● WebSocket received: Main.VideoMode=NTSC
● WebSocket received: Main.Volume=-22
● WebSocket received: Main.Volume.Max=6
● WebSocket received: Main.Volume.Min=-99
 */
