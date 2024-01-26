import { MouseEvent, useState, useEffect, useRef } from "react";
import { ControlClickedProps } from '../WebCamControls/WebCamControls';

function ZoomOut(props: { handleControlClicked: ControlClickedProps }) {

  type SvgPointsElementData = { id: string, zoomDirection: string, currentFillColour: string, originalFillColour: string };

  const svgPointsData: Array<SvgPointsElementData> = [
    { id: 'zoom-in-01', zoomDirection: 'in', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'zoom-in-02', zoomDirection: 'in', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'zoom-in-03', zoomDirection: 'in', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'zoom-in-04', zoomDirection: 'in', currentFillColour: '#333741', originalFillColour: '#333741' },
  ]

  const [pointsData, setPointsData] = useState(svgPointsData);
  const [cursorStyle, setCursorStyle] = useState({});

  const instance = useRef({ timer: 0 });

  useEffect(() => {
    // What you return is the cleanup function
    return () => {
      clearTimeout(instance.current.timer);
    };
  }, []);

  const handleMouseOver = () => (e: MouseEvent<SVGPathElement>) => {
    const currentElementId = e.currentTarget.getAttribute('id');
    const currentDirection = svgPointsData.filter(s => s.id === currentElementId)[0].zoomDirection;

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.zoomDirection === currentDirection && (p.id !== 'zoom-in-03' && p.id !== 'zoom-in-04')) {
        return { ...p, currentFillColour: '#333741' };
      } else if (p.zoomDirection === currentDirection && p.id === 'zoom-in-03') {
        return { ...p, currentFillColour: 'white' };
      } else if (p.zoomDirection === currentDirection && p.id === 'zoom-in-04') {
        return { ...p, currentFillColour: 'white' };
      } else {
        return p;
      }
    }));

    setCursorStyle({ 'cursor': 'pointer' });
  };

  const handleMouseOut = () => () => {

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.id === 'zoom-in-01' || p.id === 'zoom-in-02') {
        return { ...p, currentFillColour: p.originalFillColour };
      } else if (p.id === 'zoom-in-03' || p.id === 'zoom-in-04') {
        return { ...p, currentFillColour: p.originalFillColour };
      } else {
        return p;
      }
    }));

    setCursorStyle({});
  };

  const handleMouseClick = () => (e: MouseEvent<SVGPathElement>) => {
    props.handleControlClicked('zoom', 'out');

    const currentElementId = e.currentTarget.getAttribute('id');
    const currentDirection = svgPointsData.filter(s => s.id === currentElementId)[0].zoomDirection;

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.zoomDirection === currentDirection && (p.id !== 'zoom-in-03' && p.id !== 'zoom-in-04')) {
        return { ...p, currentFillColour: 'red' };
      } else {
        return p;
      }
    }));

    // From https://stackoverflow.com/questions/67072320/how-to-cleanup-settimeout-setinterval-in-event-handler-in-react
    // Neeed to understand this better!!!!
    clearTimeout(instance.current.timer);
    // Set the timeout and remember the value on the object
    instance.current.timer = setTimeout(() => {
      setPointsData((pointsData) => pointsData.map(p => {
        return { ...p, currentFillColour: p.originalFillColour };
      }));
    }, 600);

  }

  return (
    <svg style={cursorStyle}
      viewBox="0 0 187.5 187.5"
      y={0}
      x={0}
      xmlns="http://www.w3.org/2000/svg"
      width={80}
      height={80}
    >
      <title>Zoom out</title>
      <g transform="translate(-278.89 -680.61)">
        <rect onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
          id='zoom-in-01'
          rx={3.6425221}
          ry={3.9058104}
          transform="matrix(.86652 -.49915 .52624 .85034 0 0)"
          width={14.5697}
          y={866.93842}
          x={-84.281883}
          height={60.930473}
          fill={pointsData.filter(s => s.id === 'zoom-in-02')[0].currentFillColour}
          stroke="#000"
          strokeWidth={3.3954}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
          id='zoom-in-02'
          d="M408.45 746.743a30.84 30.84 0 11-61.682 0 30.84 30.84 0 1161.681 0z"
          strokeLinejoin="round"
          stroke="#000"
          strokeLinecap="round"
          strokeWidth={3.3856972100000005}
          fill={pointsData.filter(s => s.id === 'zoom-in-02')[0].currentFillColour}
        />
        <path onClick={handleMouseClick()}
          id='zoom-in-03'
          d="M355.31 739.82s2-11.03 12.53-15.54 22.72.83 22.72.83-12.69 1.5-20.22 4.51c-7.52 3.01-15.03 8.7-15.03 10.2z"
          fillRule="evenodd"
          fill={pointsData.filter(s => s.id === 'zoom-in-03')[0].currentFillColour}
        />
        <path onClick={handleMouseClick()}
          id='zoom-in-04'
          d="M374.856 749.36l.204.05h-9.35v-3.94h9.35l.136.052 3.98-.136-.136.084h9.36v3.94h-9.36l.409.018-5.002-.137"
          fill={pointsData.filter(s => s.id === 'zoom-in-04')[0].currentFillColour}
        />
      </g>
    </svg>
  )
}

export default ZoomOut
