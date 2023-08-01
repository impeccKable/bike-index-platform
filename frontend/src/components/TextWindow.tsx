
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
    

    return (
        <>
            <div className="text-window">
                <div>
                    <button hidden={adminRole} className="btn-darkgreen">Update</button>
                    <textarea defaultValue={headerText} className="text-area" readOnly={!adminRole}></textarea>
                </div>
            </div>
        </>
    )
}