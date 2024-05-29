import React from 'react'
import EmployeeFilter from './EmployeeFilter.jsx'
import EmployeeAdd from './EmployeeAdd.jsx'

function EmployeeTable(props) {

    const employeeRows = props.employees.map(employee => 
        <EmployeeRow 
            key={employee._id} 
            employee={employee}
            deleteEmployee={props.deleteEmployee} />)

    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Extension</th>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Date Hired</th>
                    <th>Currently Employed?</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {employeeRows}
            </tbody>
        </table>
    )

}

function EmployeeRow(props) {
    function onDeleteClick() {
        props.deleteEmployee(props.employee._id)
    }

    return (
        <tr>
            <th>{props.employee.name}</th>
            <th>{props.employee.extension}</th>
            <th>{props.employee.email}</th>
            <th>{props.employee.title}</th>
            <th>{props.employee.dateHired.toDateString()}</th>
            <th>{props.employee.currentlyEmployed ? 'Yes' : 'No'}</th>
            <th><button onClick={onDeleteClick}>DELETE</button></th>
        </tr>
    )
}

export default class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = { employees: [] }
        this.createEmployee = this.createEmployee.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                console.log('Total count of employees: ', data.count)
                data.employees.forEach(employee => {
                    employee.dateHired = new Date(employee.dateHired)
                })
                this.setState({ employees: data.employees})
            })
            .catch(error => {console.log(error)})
    }

    createEmployee(employee) {
        fetch('/api/employees', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(employee)
        })
            .then(response => response.json())
            .then(newEmployee => {
                newEmployee.employee.dateHired = new Date(newEmployee.employee.dateHired)
                const newEmployees = this.state.employees.concat(newEmployee.employee)
                this.setState({ employees: newEmployees })
                console.log('Total count of employees: ', newEmployees.length)
            })
            .catch(error => {console.log(error)})
    }

    deleteEmployee(id) {
        fetch(`/api/employees/${id}`, {method: 'DELETE'})
            .then(response => {
                if (!response.ok) {
                    console.log('Failed to delete employee.')
                } else {
                    this.loadData()
                }
            })
            .catch(error => {console.log(error)})
    }

    render() {
        return (
            <React.Fragment>
                <h1>Employee Management Application</h1>
                <hr />
                <EmployeeFilter />
                <hr />
                <EmployeeTable employees={this.state.employees} deleteEmployee={this.deleteEmployee} />
                <hr />
                <EmployeeAdd createEmployee={this.createEmployee} />
            </React.Fragment>
        )
    }
}
