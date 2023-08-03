
import { useState, useEffect } from 'react';
import { isAdmin } from '../services/Recoil';
import { useRecoilState } from 'recoil';
import { httpClient } from '../services/HttpClient';

export default function TextWindow(props: any) {
    const [adminRole, setAdminRole] = useRecoilState(isAdmin);
    const [headerText, setHeaderText] = useState("");

    useEffect(() => {
        const GetTextContent = async () => {
            const response =  await httpClient.get(`/textContent?pageName=${props.pageName}`);
            if (response.status === 200) {
                setHeaderText(response.data);
            }
            else {
                setHeaderText("Not Available");
            }
        };

        GetTextContent();
    }, []);

    async function HandleUpdate() {
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
                <div>
                    <button title='Save Text Changes' hidden={adminRole} className="btn-upd" onClick={HandleUpdate}>&#8634;</button>
                    <textarea 
                        defaultValue={headerText}
                        className="text-area"
                        readOnly={adminRole}
                        onChange={(event: any) => {
							setHeaderText(event.target.value);
						}}></textarea>
                </div>
            </div>
        </>
    )
}