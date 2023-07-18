import React, { useState } from 'react';
import { Thief } from '../pages/ThiefList.tsx';
import { useNavigate } from 'react-router-dom';

interface ThiefTableProps extends React.HTMLInputElement {
  thiefs: Array<Thief>;
}

const maxRow = 2;

export default function ThiefTable(props: ThiefTableProps) {
  const navigate = useNavigate();
  const [lowerIndex, setLowerIndex] = useState(0);

  return (
    <div>
      <div className="container thief-table-div">
        <table className="thief-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {props.thiefs
              .slice(lowerIndex, lowerIndex + maxRow)
              .map((thief) => {
                return (
                  <tr
                    key={thief.thiefId}
                    className="tr-link"
                    onClick={() =>
                      navigate(`/thiefEdit?thiefId=${thief.thiefId}`)
                    }
                  >
                    <td>{thief.thiefId}</td>
                    <td>{thief.name.join(', ')}</td>
                    <td>{thief.phone.join(', ')}</td>
                    <td>{thief.email.join(', ')}</td>
                    <td>{thief.addr}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="prev-next-button">
        {props.thiefs.length > maxRow ? (
          lowerIndex === 0 ? (
            <a onClick={() => setLowerIndex(lowerIndex + maxRow)}>Next</a>
          ) : (
            <>
              <a onClick={() => setLowerIndex(lowerIndex - maxRow)}>Prev</a>{' '}
              <a onClick={() => setLowerIndex(lowerIndex + maxRow)}>Next</a>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
