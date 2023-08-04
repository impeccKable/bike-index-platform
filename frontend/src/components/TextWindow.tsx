
import { useState, useEffect } from 'react';
import { isAdmin } from '../services/Recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { httpClient } from '../services/HttpClient';

export default function TextWindow(props: any) {
    const [adminStatus, setAdminStatus] = useState(useRecoilValue(isAdmin));
    const [headerText, setHeaderText] = useState("");
    const [oldValue, setOldValue] = useState("");
    const [showHeader, setShowHeader] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const GetTextContent = async () => {
            const response =  await httpClient.get(`/textContent?pageName=${props.pageName}`);
            if (response.status === 200) {
                setHeaderText(response.data.body);
                setOldValue(response.data.body);

                if (response.data.body !== "" && !response.data.ishidden) {
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
                    <button title='View Window Settings' hidden={!adminStatus} className="btn-stg" onClick={() => {setShowModal(true)}}>&#9881;</button>
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
                <div>
                    <button onClick={() => {setShowHeader(true)}}>Show Header Panel</button>
                </div>
                }
            </div>
            { showModal &&
            <div id="myModal" className="modal" hidden={true}>
                <div className="modal-content">
                    <span className="close" onClick={() => {setShowModal(false)}}>&times;</span>
                    <h4>Header Text Settings</h4>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Hide Panel From Viewers</th>
                                    <td>
                                        <label htmlFor="SetHidden">Hide Text from View</label>
                                        <input type='checkbox' id="SetHidden"></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <label htmlFor="SetLabel">Text Label</label>
                        <input type='checkbox' id="SetLabel"></input>
                    </div>
                </div>
            </div>
            }
        </>
    )
}