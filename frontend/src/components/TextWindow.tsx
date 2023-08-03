
import { useState, useEffect } from 'react';
import { isAdmin } from '../services/Recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { httpClient } from '../services/HttpClient';

export default function TextWindow(props: any) {
    const [adminStatus, setAdminStatus] = useState(useRecoilValue(isAdmin));
    const [headerText, setHeaderText] = useState("");
    const [oldValue, setOldValue] = useState("");
    const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
        const GetTextContent = async () => {
            const response =  await httpClient.get(`/textContent?pageName=${props.pageName}`);
            if (response.status === 200) {
                setHeaderText(response.data);
                setOldValue(response.data);

                if (response.data !== "") {
                    setShowHeader(true);
                }
            }
            else {
                setHeaderText("Not Available");
            }
        };

        GetTextContent();
    }, []);
    async function HandleUpdate() {

        if (oldValue === headerText) {
            console.log("No Changes Detected");
            return;
        }
        const data = {
            'pageName': props.pageName,
            'body': headerText
        }
        const response = await httpClient.put("/textContent", data);

        console.log("Put Response Text Content", response);
    }
    

    return (
        <>
            <div className="text-window">
                { showHeader 
                ?
                <div>
                    <button title='Save Text Changes' hidden={!adminStatus} className="btn-upd" onClick={HandleUpdate}>&#8634;</button>
                    <textarea 
                        defaultValue={headerText}
                        className="text-area"
                        readOnly={!adminStatus}
                        onChange={(event: any) => {
							setHeaderText(event.target.value);
						}}></textarea>
                </div>
                :
                <div><button onClick={() => {setShowHeader(true)}}>Show Header Panel</button></div>
                }
            </div>
        </>
    )
}