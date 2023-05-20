import React from 'react';
import { useState } from 'react';
import { LinkButton } from './Form';

interface ThiefTableProps extends React.HTMLInputElement {
  filter: string;
  type: string;
}

let testPersons = [
  {
    id: 1,
    name: 'Test Name 1',
    phone: '+1 123-456-7890',
    email: 'email1@gmail.com',
    approved: 'true',
  },
  {
    id: 2,
    name: 'Test Name 2',
    phone: '+2 123-456-7890',
    email: 'email2@gmail.com',
    approved: 'false',
  },
];

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
          {testPersons.map((person) => {
            return (
              <tr key={person.id}>
                <td>
                  <LinkButton
                    className="thief-edit"
                    to={`/thief?name=${person.name}&email=${person.email}`}
                  >
                    Edit
                  </LinkButton>
                </td>
                <td>{person.name}</td>
                <td>{person.phone}</td>
                <td>{person.email}</td>
                {adminStatus ? <td>{person.approved}</td> : ''}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
