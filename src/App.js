import './App.css';
import Papa from 'papaparse';
import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";

function App() {
    const [dateState, setDateState] = useState(null);
    const [data, setData] = useState([]);
    const pincode = useRef(null);
    const [csvData, setCsvData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);;

    const changeHandler = (e) => {
        //used papaparse snippet
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function(result) {
                const rowsArray = [];
                const valuesArray = [];
                result.data.map(data => {
                    rowsArray.push(Object.keys(data));
                    valuesArray.push(Object.values(data));
                });
                setCsvData(result.data);
                setTableRows(rowsArray[0]);
                setValues(valuesArray);
                setData(valuesArray);
            }
        });
    }

    function filter() {
        const pinCode = pincode.current.value !== '' ? pincode.current.value : null;
        const date = dateState ? moment(dateState).format('DD/MM/YYYY') : null;
        let result;
        if (pinCode !== null && date !== null) {
            result = data.filter(value => value[2].toString().startsWith(pinCode) && value[3].toString() === date);
        } else if (pinCode && date === null) {
            result = data.filter(value => value[2].toString().indexOf(pinCode) > -1);
        } else if (pinCode === null && date) {
            result = data.filter(value => value[3].toString() === date);
        } else if (pinCode === null && date === null) {
            result = data;
        }
        setValues(result);
    }

    const handlePinChange = (e) => {
        filter();
    }

    const handleChangeDate = (date) => {
        filter();
    }
    const handlePinSort = () => {
        const result = [...data].sort(((a, b) => (a[2] > b[2]) ? 1 : -1))
        setValues(result);
    }

    const handleDateSort = () => {
        const result = [...data].sort((a,b) => new Date(a[3]).getTime() - new Date(b[3]).getTime())
        setValues(result);
    }

    return (
        <div>
            <input
                type="file"
                name="file"
                accept=".csv"
                onChange={changeHandler}
                style={{ display: "block", margin: "10px auto" }}
            />
            <br />
            <br />
            {data.length > 0 ? 
                <div style={{'marginBottom': '10px'}} className="flex-container">
                    <div style={{'marginLeft': '150px'}}>
                        <label>Pin Code: </label>
                        <input onChange={handlePinChange} ref={pincode} type='text' placeholder='Enter picode' style={{'padding': '5px 3px','fontSize': '15px'}} />
                    </div>
                    <div style={{'marginRight': '105px'}}>
                        <label style={{'position': 'relative', 'right': '50px', 'top': '17px'}}>Date: </label>
                        <DatePicker selected={dateState} onChange={(date) => setDateState(date)} onCalendarClose={handleChangeDate} style={{'padding': '5px 3px','fontSize': '15px'}} />  
                    </div>
                </div>
            :
                <div style={{'textAlign': 'center'}}>Data not found</div>
            }
            
            <table id="customers">
                <thead>
                    <tr>
                        {tableRows.map((rows, index)=> {
                            if (rows === 'deliveryPincode') {
                                return <th style={{'cursor': 'pointer'}} key={index} onClick={handlePinSort}>{rows}</th>
                            } else if (rows === 'orderDate') {
                                return <th style={{'cursor': 'pointer'}} key={index} onClick={handleDateSort}>{rows}</th>
                            } else {
                                return <th key={index}>{rows}</th>
                            }
                        })}
                    </tr>
                </thead>
                <tbody>
                    {values.map((values, index) => {
                        return (
                            <tr key={index}>
                                {values.map((val, i) => {
                                    if (val.includes(';')) {
                                        val = val.split(';').filter(ele => ele).join('\n');
                                       return <td key={i}>
                                           {val}
                                       </td>
                                    } else {
                                        return <td key={i}>{val}</td>
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
