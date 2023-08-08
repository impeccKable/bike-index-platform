
import { httpClient } from '../services/HttpClient';
import { isAdmin } from '../services/Recoil';
import { useState, useEffect } from 'react';
import loading from '../assets/loading.gif';
import { useRecoilValue } from 'recoil';

export default function TextWindow(props: any) {
    const [adminStatus, setAdminStatus] = useState(useRecoilValue(isAdmin));
    const [showHeaderOld, setShowHeaderOld] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [headerLabel, setHeaderLabel] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [headerText, setHeaderText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isHidden, setIsHidden] = useState(false);
    const [oldValue, setOldValue] = useState("");

    useEffect(() => {
        const GetTextContent = async () => {
            // grabs this pages content or inserts new then fetches
            const response =  await httpClient.get(`/textContent?pageName=${props.pageName}`);
            
            if (response.status === 200) {    
                setHeaderText(response.data.body);
                // keep track of changes
                setOldValue(response.data.body);
                setHeaderLabel(response.data.label);

                if (response.data.body !== "" && !response.data.ishidden) {
                    setShowHeaderOld(true);
                }
            }
            else {
                setHeaderText("Not Available");
            }
            setIsLoading(false);
        };
        GetTextContent();
    }, []);

    async function HandleUpdate() {
        if (oldValue === headerText) {
            setUpdateMessage("No Changes Detected.");
        }
        else {
            const data = {
                'pageName': props.pageName,
                'body': headerText
            }
            const response = await httpClient.put("/textContent", data);
            
            if (response.status === 200) {
                setOldValue(headerText);
                setUpdateMessage("Update Successful!");
            }
            else {
                setUpdateMessage("Error, Try Again.");
            }
        }

       setTimeout(() => {
            setUpdateMessage("");
        }, 10000);
    }

    async function  UpdateSettings() {
        const data = {
            pageName: props.pageName,
            label: headerLabel,
            isHidden: isHidden
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
        <div className="bottom-spacer">
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
                    { isLoading ?
                    <img src={loading} alt="loading" width="30px" height="30px"/>
                    :
                    <button hidden={!adminStatus} onClick={() => {setShowHeaderOld(true)}}>Show Header Panel</button>
                }
                </div>
                }
            </div>
            <div className="text-window"><h4>{updateMessage}</h4></div>
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
                                    <th><label htmlFor="SetHidden">Show Header On Render</label></th>
                                    <td><input type='checkbox' id="SetHidden" checked={showHeaderOld} onChange={() => {setIsHidden(showHeaderOld); setShowHeaderOld(!showHeaderOld)}}></input></td>
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