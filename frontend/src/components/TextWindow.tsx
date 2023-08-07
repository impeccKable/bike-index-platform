
import { useState, useEffect } from 'react';
import { isAdmin } from '../services/Recoil';
import { useRecoilValue } from 'recoil';
import { httpClient } from '../services/HttpClient';

export default function TextWindow(props: any) {
    const [adminStatus, setAdminStatus] = useState(useRecoilValue(isAdmin));
    const [headerText, setHeaderText] = useState("");
    const [headerLabel, setHeaderLabel] = useState("");
    const [oldValue, setOldValue] = useState("");
    const [showHeaderOld, setShowHeaderOld] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const GetTextContent = async () => {
            const response =  await httpClient.get(`/textContent?pageName=${props.pageName}`);
            if (response.status === 200) {
                setHeaderText(response.data.body);
                setOldValue(response.data.body);
                setHeaderLabel(response.data.label);
                

                if (response.data.body !== "" && !response.data.ishidden) {
                    setShowHeaderOld(true);
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

    async function  UpdateSettings() {
        const data = {
            pageName: props.pageName,
            label: headerLabel,
            isHidden: showHeaderOld
        }
        const response = await httpClient.put("/textContent", data);

        if (response.status === 200) {
            setModalMessage("Save Complete!");
        }
        else {
            setModalMessage("Error Try Again");
        }
    }
    

    return (
        <>
            <div className="text-window">
                { showHeaderOld 
                ?
                <div>
                    <button title='View Window Settings' hidden={!adminStatus} className="btn-stg" onClick={() => {setShowModal(true); setModalMessage("");}}>&#9881;</button>
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
                    <button hidden={!adminStatus} onClick={() => {setShowHeaderOld(true)}}>Show Header Panel</button>
                </div>
                }
            </div>
            { showModal &&
            <div id="myModal" className="modal" hidden={true}>
                <div className="modal-content">
                    <h4>Header Text Settings</h4>
                    <span className="close" onClick={() => {setShowModal(false)}}>&times;</span>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <th><label htmlFor="SetHidden">Hide Text On Render</label></th>
                                    <td><input type='checkbox' id="SetHidden" checked={!showHeaderOld} onChange={() => {setShowHeaderOld(showHeaderOld ? true : false)}}></input></td>
                                </tr>
                                <tr>
                                    <th><label htmlFor="SetLabel">Set Header Label</label></th>
                                    <td><input type='text' id="SetLabel" value={headerLabel} onChange={(event:any) => {setHeaderLabel(event.target.value)}}></input></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button onClick={UpdateSettings}>Save Changes</button>
                    </div>
                    <div>
                        <p>{modalMessage}</p>
                    </div>
                </div>
            </div>
            }
        </>
    )
}