/**
  * ## This code is part of the Code Genome Framework.
  * ##
  * ## (C) Copyright IBM 2022-2023.
  * ## This code is licensed under the Apache License, Version 2.0. You may
  * ## obtain a copy of this license in the LICENSE.txt file in the root directory
  * ## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
  * ##
  * ## Any modifications or derivative works of this code must retain this
  * ## copyright notice, and modified files need to carry a notice indicating
  * ## that they have been altered from the originals.
  * ##
  */

import React, { FC, useRef, useState } from 'react';
import styles from './ElapsedTimeLoader.module.scss';

/**
 * @author habeck
 * @param labelClass - (optional) override the default class of 16 px with a 12px label. 'sm'
 */

export interface ElapsedTimeLoaderProps { label: string, start_ts: number, end_ts?: number, error_ts?: number, textPosition?: string, labelClass?: string}

/**
 * 
 * @param elapsed - The elapsed time in milliseconds to convert into hh:mm:dd format
 * @returns The elapsed time in the format 'hh:mm:ss'
 */
function getElapsedTimeStirng(elapsed: number) : { timeStr: string, arcDeg: number} {
  let ets = '';
  const hours = (Number((elapsed/1000).toFixed(0))/60/60);
  const rawHrs = ''+hours;

  const hrStr = ('' + Math.floor(hours) ).padStart(2,'0')
  // Get the minutes and seconds value
  let hmStr = rawHrs.split('.')[1];
  if (hmStr === undefined) {
    hmStr = '0';
  }
  // Now get the minutes value and seconds value.
  const rawMin = (Number('.' + hmStr) * 60);
  const minutes =  (''+Math.floor(rawMin)).padStart(2,'0');
  let secStr = ('' + rawMin).split('.')[1];
  if (secStr === undefined) {
    secStr = '00';
  } else {
    secStr = (Number('.' + secStr) * 60).toFixed(0);
    secStr = ('' + secStr).padStart(2,'0');
  }
  const arcDeg = (Number(secStr)) * 6;
  return { timeStr: (hrStr +':'+ minutes + ':' + secStr), arcDeg };
}



export const ElapsedTimeLoader: FC<ElapsedTimeLoaderProps> = (props) => { 
  const ovalRef = useRef(null);
  const { timeStr , arcDeg} = getElapsedTimeStirng((props.end_ts && props.end_ts > -1 && props.start_ts > -1 ? props.start_ts && props.start_ts> -1  ? props.end_ts - props.start_ts : new Date().getTime() - props.start_ts : 0));
  const [timeString, setTimeString] = useState(timeStr);
  const [fillUrl, setFillUrl] = useState("url(#radialGradient-running)");
  const [rotation, setRotation] = useState("rotate(0, 41.5, 40.5)");
  const [textPosition, setTextPosition] = useState(props.textPosition==='top' ? 'translate(0.000000,-2.000000)' : 'translate(0.000000, 85.000000)' );
  const [timerPosition, setTimerPosition] = useState(props.textPosition === 'top' ? 'translate(66.000000, 321.000000)' : 'translate(66.000000, 304.000000)');
  const [labelClass, setLabelClass] = useState(props.labelClass === 'sm' ? styles.propsLabel_sm : styles.propsLabel);

  setTimeout( () => {
    const { timeStr , arcDeg} = getElapsedTimeStirng((props.end_ts && props.end_ts > -1 && props.start_ts && props.start_ts > -1 ? props.end_ts - props.start_ts : props.error_ts && props.error_ts > -1  && props.start_ts > -1 ? props.error_ts - props.start_ts : props.start_ts > -1 ? new Date().getTime() - props.start_ts : 0))
    setTimeString(timeStr);
    setRotation("rotate("+ arcDeg+", 41.5, 40.5)");
    if (props.end_ts && props.end_ts === -1) {
      setFillUrl("url(#radialGradient-running)");
    }
    if (props.end_ts && props.end_ts > -1) {
      setFillUrl("url(#radialGradient-green)");
    }
    if (props.error_ts && props.error_ts > -1) {
      setFillUrl("url(#radialGradient-red)");
    }
  }, 1000);
  
  return (
  <div data-testid="ElapsedTimeLoader">

<svg width="150px" height="115px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <defs>
        <radialGradient cx="48.941626%" cy="50%" fx="48.941626%" fy="50%" r="65.9282549%" gradientTransform="translate(0.489416,0.500000),rotate(90.000000),scale(1.000000,0.947006),translate(-0.489416,-0.500000)" id="radialGradient-running">
            <stop stopColor="#2E7ACC" offset="0%"></stop>
            <stop stopColor="#000000" offset="100%"></stop>
        </radialGradient>
        <radialGradient cx="48.941626%" cy="50%" fx="48.941626%" fy="50%" r="52.9282549%" gradientTransform="translate(0.489416,0.500000),rotate(90.000000),scale(1.000000,0.947006),translate(-0.489416,-0.500000)" id="radialGradient-green">
            <stop stopColor="#00FF00" offset="0%"></stop>
            <stop stopColor="#000000" offset="100%"></stop>
        </radialGradient>
        <radialGradient cx="48.941626%" cy="50%" fx="48.941626%" fy="50%" r="52.9282549%" gradientTransform="translate(0.489416,0.500000),rotate(90.000000),scale(1.000000,0.947006),translate(-0.489416,-0.500000)" id="radialGradient-red">
            <stop stopColor="#FF0000" offset="0%"></stop>
            <stop stopColor="#000000" offset="100%"></stop>
        </radialGradient>
    </defs>
    <g id="IBM-Code-Genome-Mock-up-Copy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="MacBook-Pro-16&quot;" transform="translate(-78.000000, -304.000000)">
            <g id="Group-3" transform={timerPosition}>
                <g id="Group-2" transform="translate(12.000000, 0.000000)">
                    <g id="Group-Copy">
                        <circle ref={ovalRef} id="Oval" stroke="#979797" fill={fillUrl} cx="41" cy="41" r="40.5"></circle>
                        <line x1="41.5" y1="1.5" x2="41.5" y2="43.5" id="Line" stroke="#979797" fill="#979797" strokeLinecap="square" transform={rotation}/>
                        <circle id="Oval" fill="#252525" cx="41" cy="41" r="32"></circle>
                    </g>
                    <g id="Group" transform="translate(17.000000, 33.000000)" fill="#2E7ACC" fontFamily="IBMPlexSans, IBM Plex Sans" fontSize="12" fontWeight="normal">
                        <text id="hh:mm:ss">
                            <tspan x="0" y="12">{timeString}</tspan>
                        </text>
                    </g>
                </g>
            </g>
        </g>
        <g id="Group2" transform={textPosition} fill="#897F7F" fontFamily="IBMPlexSans, IBM Plex Sans" fontSize='16px' fontWeight="normal">
        <text>
          <tspan x="42" y="14" className={labelClass} textAnchor='middle' >{props.label}</tspan>
        </text>
        </g>
    </g>
</svg>
  </div>
);
}
export default ElapsedTimeLoader;
