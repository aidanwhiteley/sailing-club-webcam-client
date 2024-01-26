import './MoveRange.css'

type MoveAmountHandlerProps = (moveAmount: number) => void

function MoveSizeRange(props: { handleMoveAmountClicked: MoveAmountHandlerProps, moveAmount: number }) {

    const handleRangeValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.handleMoveAmountClicked(parseInt(event.target.value));
    }

    return (
        <>
            <div className="move-range-label">
                <label htmlFor="moveRange">Movement size</label>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg me-1" viewBox="0 0 16 16">
                <title>Decrease movement size</title>
                <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
            </svg>
            <input type="range" id="moveRange" name="moveRange" className="move-range-input" onChange={handleRangeValueChanged}
                min="1" max="10" step="1" list="moveRangeMarkers" value={props.moveAmount} />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-plus-lg ms-1" viewBox="0 0 16 16">
                <title>Increase movement size</title>
                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>

            <datalist id="moveRangeMarkers">
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option value="4"></option>
                <option value="5"></option>
                <option value="6"></option>
                <option value="7"></option>
                <option value="8"></option>
                <option value="9"></option>
                <option value="10"></option>
            </datalist>
        </>
    );
}

export default MoveSizeRange;