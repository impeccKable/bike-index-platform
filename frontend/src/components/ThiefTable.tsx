import React from 'react';
import { useState, useEffect } from 'react';
import { LinkButton } from './Form';
import { Link } from 'react-router-dom';

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
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            {adminStatus ? <th>Approved</th> : ''}
          </tr>
        </thead>
        <tbody>
          {props.people.map((person) => {
            return (
              <Link
                key={`Row${person.id}`}
                className="row-link"
                to={`/thief?id=${person.id}`}
              >
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.phone}</td>
                  <td>{person.email}</td>
                  {adminStatus ? <td>{person.approved.toString()}</td> : ''}
                </tr>
              </Link>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
