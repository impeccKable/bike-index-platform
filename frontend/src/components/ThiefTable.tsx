import React from 'react';
import { useState } from 'react';
import { LinkButton } from './Form';

interface Person extends React.HTMLInputElement {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  approved: boolean | string;
}

interface ThiefTableProps extends React.HTMLInputElement {
  people: Array<Person>;
}

export default function ThiefTable(props: ThiefTableProps) {
  const [adminStatus, setAdminStatus] = useState(true);

  return (
    <div className="container thief-table-div">
      <table className="thief-table">
        <thead>
          <tr>
            <th className="action-header">Actions</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            {adminStatus ? <th>Approved</th> : ''}
          </tr>
        </thead>
        <tbody>
          {props.people.map((person) => {
            return (
              <tr key={person.id}>
                <td>
                  <LinkButton
                    className="thief-edit"
                    to={`/thiefs?id=${person.id}`}
                  >
                    Edit
                  </LinkButton>
                </td>
                <td>{person.name}</td>
                <td>{person.phone}</td>
                <td>{person.email}</td>
                {adminStatus ? <td>{person.approved.toString()}</td> : ''}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
