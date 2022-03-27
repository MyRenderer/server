import * as obs from 'obs-node';
import { BrowserOverLay } from 'obs-node';
import { Project } from '../entity/project';
import { ProjectStatus } from './types';

const settings: obs.Settings = {
  video: {
    baseWidth: 1280,
    baseHeight: 720,
    outputWidth: 1280,
    outputHeight: 720,
    fpsNum: 25,
    fpsDen: 1,
  },
  audio: {
    sampleRate: 48000,
  },
};

export function startup(): void {
  obs.startup(settings);
}

export function runProject(project: Project): void {
  if (!project.inputStreamUrl || !project.outputStreamUrl || !project.renderUrl) {
    throw new Error(`Stream urls can't be empty`);
  } else if (project.status === ProjectStatus.running) {
    throw new Error(`Project already running`);
  }

  const inputName = `input_${project.id}`;
  const outputName = `output_${project.id}`;
  const overlayName = `renderer_${project.id}`;

  // Add input
  console.log(`Add input ${project.inputStreamUrl}`);

  obs.addScene(inputName);
  obs.addSource(inputName, inputName, {
    name: inputName,
    type: 'live',
    url: project.inputStreamUrl,
  });

  // Add output
  console.log(`Add output ${project.outputStreamUrl}`);
  obs.addOutput(outputName, {
    url: project.outputStreamUrl,
    hardwareEnable: false,
    width: settings.video.outputWidth,
    height: settings.video.outputHeight,
    keyintSec: 2,
    rateControl: 'CBR',
    preset: 'ultrafast',
    profile: 'main',
    tune: 'zerolatency',
    videoBitrateKbps: 3000,
    audioBitrateKbps: 128,
  });

  // Add renderer overlay
  console.log(`Add renderer overlay ${project.renderUrl}`);
  obs.addOverlay({
    id: overlayName,
    name: overlayName,
    type: 'browser',
    url: project.renderUrl,
  } as BrowserOverLay);
  obs.upOverlay(overlayName);

  obs.switchToScene(inputName, 'cut_transition', 0);
}

export function stopProject(project: Project): void {
  const inputName = `input_${project.id}`;
  const outputName = `output_${project.id}`;
  const overlayName = `renderer_${project.id}`;
  try {
    obs.removeScene(inputName);
    obs.removeOutput(outputName);
    obs.removeOverlay(overlayName);
  } catch (e) {
    console.log(`Failed to stop project`, e);
  }
}
