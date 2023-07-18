

import {useRecoilState} from 'recoil';
import {debugState, devState, prodState} from '../services/Recoil'


export default function AdminConfig() {
    //const [dev, setDevState] = useRecoilState(devState);
    const [debug, setDebugState] = useRecoilState(debugState);
    const [prod, setProdState] = useRecoilState(prodState);


    const SetDev = () => {}
    const SetDebug = () => {}
    const SetProd = () => {}




    return(
        <>
        <button></button>
        </>
    )
}