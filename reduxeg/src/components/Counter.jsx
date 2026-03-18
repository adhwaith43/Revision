import { useSelector,useDispatch} from "react-redux";
import {increment,decrement,incrementByAmount,incrementAsync} from "../state/counter/counterSlice";

const Counter=()=>{

    const count=useSelector((state)=>state.counter.value);
    const dispatch=useDispatch();

    return(
        <div>
            <h1>Counter</h1>
            <p>{count}</p>

            <div>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
                <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
                <button onClick={() => dispatch(incrementAsync(10))}>Increment Async by 10</button>
            </div>
        </div>
    )
}
export default Counter;