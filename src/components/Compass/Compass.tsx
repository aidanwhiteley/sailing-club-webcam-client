import { MouseEvent, useState, useEffect, useRef } from "react";
import { ControlClickedProps } from '../WebCamControls/WebCamControls';

function Compass(props: { handleControlClicked: ControlClickedProps }) {

  type SvgPointsElementData = { id: string, direction: string, currentFillColour: string, originalFillColour: string };

  const svgPointsData: Array<SvgPointsElementData> = [
    { id: 'point-01', direction: 'up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-02', direction: 'up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-03', direction: 'down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-04', direction: 'down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-05', direction: 'right', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-06', direction: 'right', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-07', direction: 'left', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-08', direction: 'left', currentFillColour: '#FFF', originalFillColour: '#FFF' },

    { id: 'point-21', direction: 'right-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-22', direction: 'right-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-23', direction: 'left-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-24', direction: 'left-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-25', direction: 'right-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-26', direction: 'right-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-27', direction: 'left-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-28', direction: 'left-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },

    { id: 'point-31', direction: 'left-left-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-32', direction: 'left-left-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-33', direction: 'right-right-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-34', direction: 'right-right-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-35', direction: 'right-up-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-36', direction: 'right-up-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-37', direction: 'left-down-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-38', direction: 'left-down-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },

    { id: 'point-41', direction: 'left-up-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-42', direction: 'left-up-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-43', direction: 'right-down-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-44', direction: 'right-down-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-45', direction: 'right-right-up', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-46', direction: 'right-right-up', currentFillColour: '#FFF', originalFillColour: '#FFF' },
    { id: 'point-47', direction: 'left-left-down', currentFillColour: '#333741', originalFillColour: '#333741' },
    { id: 'point-48', direction: 'left-left-down', currentFillColour: '#FFF', originalFillColour: '#FFF' },
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
    const currentDirection = svgPointsData.filter(s => s.id === currentElementId)[0].direction;

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.direction === currentDirection) {
        return { ...p, currentFillColour: '#333741' };
      } else {
        return p;
      }
    }));

    setCursorStyle({ 'cursor': 'pointer' });
  };

  const handleMouseOut = () => (e: MouseEvent<SVGPathElement>) => {
    const currentElementId = e.currentTarget.getAttribute('id');
    const currentDirection = svgPointsData.filter(s => s.id === currentElementId)[0].direction;

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.direction === currentDirection) {
        return { ...p, currentFillColour: p.originalFillColour };
      } else {
        return p;
      }
    }));

    setCursorStyle({});
  };

  const handleMouseClick = () => (e: MouseEvent<SVGPathElement>) => {

    const currentElementId = e.currentTarget.getAttribute('id');
    const currentDirection = svgPointsData.filter(s => s.id === currentElementId)[0].direction;

    props.handleControlClicked('compass', currentDirection);

    setPointsData((pointsData) => pointsData.map(p => {
      if (p.direction === currentDirection) {
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
        if (p.currentFillColour === 'red') {
          return { ...p, currentFillColour: p.originalFillColour };
        } else {
          return p;
        }
      }));
    }, 600);

  }

  return (
    <svg className="mt-2" style={cursorStyle}
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      viewBox="0 0 401.29407 401.29404"
    >

      <g fillOpacity={1} stroke="#333741" strokeOpacity={1}>

      // This is the first set of short stubby pointers
        <g
          fillRule="evenodd"
          strokeWidth="2.22388315px"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 852.362l-30 170 30 30v-200z" id='point-41'
            fill={pointsData.filter(s => s.id === 'point-41')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 852.362l30 170-30 30v-200z" id='point-42'
            fill={pointsData.filter(s => s.id === 'point-42')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 1253.482l30-170-30-30v200z" id='point-43'
            fill={pointsData.filter(s => s.id === 'point-43')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 1253.482l-30-170 30-30v200z" id='point-44'
            fill={pointsData.filter(s => s.id === 'point-44')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.941l-170-30-30 30h200z" id='point-45'
            fill={pointsData.filter(s => s.id === 'point-45')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.903l-170 30-30-30h200z" id='point-46'
            fill={pointsData.filter(s => s.id === 'point-46')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.903l170 30 30-30h-200z" id='point-47'
            fill={pointsData.filter(s => s.id === 'point-47')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.941l170-30 30 30h-200z" id='point-48'
            fill={pointsData.filter(s => s.id === 'point-48')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-22.5 3400.414 1389.663)"
          />
        </g>

        // This is the second set of short stubby pointers
        <g
          fillRule="evenodd"
          strokeWidth="2.22388315px"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 852.362l-30 170 30 30v-200z" id='point-31'
            fill={pointsData.filter(s => s.id === 'point-31')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 852.362l30 170-30 30v-200z" id='point-32'
            fill={pointsData.filter(s => s.id === 'point-32')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 1253.482l30-170-30-30v200z" id='point-33'
            fill={pointsData.filter(s => s.id === 'point-33')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 1253.482l-30-170 30-30v200z" id='point-34'
            fill={pointsData.filter(s => s.id === 'point-34')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.941l-170-30-30 30h200z" id='point-35'
            fill={pointsData.filter(s => s.id === 'point-35')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.903l-170 30-30-30h200z" id='point-36'
            fill={pointsData.filter(s => s.id === 'point-36')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.903l170 30 30-30h-200z" id='point-37'
            fill={pointsData.filter(s => s.id === 'point-37')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.941l170-30 30 30h-200z" id='point-38'
            fill={pointsData.filter(s => s.id === 'point-38')[0].currentFillColour}
            transform="translate(100.666 -852.275) scale(.44966) rotate(-67.5 1125.467 1605.683)"
          />
        </g>

        // This is the outer circle path
        {/* <path
          d="M100 889.513a162.85 162.85 0 00-162.85 162.85A162.85 162.85 0 00100 1215.211a162.85 162.85 0 00162.85-162.85A162.85 162.85 0 00100 889.512zm0 28.35a134.5 134.5 0 01134.5 134.5 134.5 134.5 0 01-134.5 134.5 134.5 134.5 0 01-134.5-134.5 134.5 134.5 0 01134.5-134.5z"
          opacity={0.1}
          fill="#300"
          strokeWidth={1.1}
          strokeMiterlimit={4}
          strokeDasharray="none"
          transform="translate(100.666 -852.275)"
        /> */}

        // This is the intermediate direction arrows
        <g
          fillRule="evenodd"
          strokeWidth="1px"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M185.055 967.864l-84.828 59.38v25.449l84.828-84.829z" id='point-21'
            fill={pointsData.filter(s => s.id === 'point-21')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M185.04 967.848l-59.38 84.829h-25.45l84.83-84.829z" id='point-22'
            fill={pointsData.filter(s => s.id === 'point-22')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M14.907 1137.98l84.829-59.38v-25.448l-84.829 84.828z" id='point-23'
            fill={pointsData.filter(s => s.id === 'point-23')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M14.923 1137.996l59.38-84.828h25.449l-84.829 84.828z" id='point-24'
            fill={pointsData.filter(s => s.id === 'point-24')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M185.04 1137.996l-59.38-84.828h-25.45l84.83 84.828z" id='point-25'
            fill={pointsData.filter(s => s.id === 'point-25')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M185.055 1137.98l-84.828-59.38v-25.448l84.828 84.828z" id='point-26'
            fill={pointsData.filter(s => s.id === 'point-26')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M14.923 967.848l59.38 84.829h25.449l-84.829-84.829z" id='point-27'
            fill={pointsData.filter(s => s.id === 'point-27')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M14.907 967.864l84.829 59.38v25.449l-84.829-84.829z" id='point-28'
            fill={pointsData.filter(s => s.id === 'point-28')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
        </g>

        // This is the primary direction arrows
        <g
          fillRule="evenodd"
          strokeWidth="1px"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 852.362l-30 170 30 30v-200z" id='point-01'
            fill={pointsData.filter(s => s.id === 'point-01')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 852.362l30 170-30 30v-200z" id='point-02'
            fill={pointsData.filter(s => s.id === 'point-02')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M99.962 1253.482l30-170-30-30v200z" id='point-03'
            fill={pointsData.filter(s => s.id === 'point-03')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M100 1253.482l-30-170 30-30v200z" id='point-04'
            fill={pointsData.filter(s => s.id === 'point-04')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.941l-170-30-30 30h200z" id='point-05'
            fill={pointsData.filter(s => s.id === 'point-05')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M300.541 1052.903l-170 30-30-30h200z" id='point-06'
            fill={pointsData.filter(s => s.id === 'point-06')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.903l170 30 30-30h-200z" id='point-07'
            fill={pointsData.filter(s => s.id === 'point-07')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
          <path onMouseOver={handleMouseOver()} onMouseOut={handleMouseOut()} onClick={handleMouseClick()}
            d="M-100.579 1052.941l170-30 30 30h-200z" id='point-08'
            fill={pointsData.filter(s => s.id === 'point-08')[0].currentFillColour}
            transform="translate(100.666 -852.275)"
          />
        </g>
      </g>
    </svg>
  )
}

export default Compass
