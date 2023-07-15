
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';

export default function DebugLogs(message: any, data: any) {
    let debug = useRecoilValue(debugState);

    if (debug) {
        console.log(message, data);
    }
}
