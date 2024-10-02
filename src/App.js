import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import { styled as styledC } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StyledTableCell = styledC(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styledC(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function App() {
  const [users, setUsers] = useState([]);
  const [totalBusIda, setTotalBusIda] = useState(0);
  const [totalBusVuelta, setTotalBusVuelta] = useState(0);
  const [totalIntolerancias, setTotalIntolerancias] = useState(0);
  const [totalPreboda, setTotalPreboda] = useState(0);
  const [totalAsistencia, setTotalAsistencia] = useState(0);
  const [totalCancionesDiferentes, setTotalCancionesDiferentes] = useState(0);

  const createData = (nombre, asistencia, asistenciaPreboda, cancionSugerida, intolerancias, busIda, busVuelta) => {
    return {nombre, asistencia, asistenciaPreboda, cancionSugerida, intolerancias, busIda, busVuelta}
  }

  useEffect(() => {
    const getUsers = async() => {
      const response = await fetch("https://invitacion-back.vercel.app/invitados/invitados");
      const parseResponse = await response.json();

      if(!parseResponse.error){
        const usersWithStyle = parseResponse.message.map(el => {
          return createData(
            el.nombre,
            el.asistencia,
            el.asistenciaPreboda,
            el.cancionSugerida,
            el.intolerancias,
            el.busIda,
            el.busVuelta
          )
        })
        setUsers(usersWithStyle)
        if(usersWithStyle.length > 0){
          setTotalBusIda(()=>{
          const total = parseResponse.message.filter(e => e.busIda === "Sí")
          return total.length;
          })
          setTotalBusVuelta(()=>{
            const total = parseResponse.message.filter(e => e.busVuelta === "Sí")
            return total.length;
          })
          setTotalIntolerancias(() => {
            const total = parseResponse.message.filter(e => e.intolerancias !== "No" && e.intolerancias !== "")
            let datos = []

            total.forEach(e => {
              datos.push(e.intolerancias)
            })
            datos = [...new Set(datos)]
            console.log(datos)
            datos.join(',');
            return {length: datos.length, int: datos};
          });
          setTotalAsistencia(() => {
            const total = parseResponse.message.filter(e => e.asistencia === "Sí")
            return total.length;
          })
          setTotalPreboda(() => {
            const total = parseResponse.message.filter(e => e.asistenciaPreboda === "Sí")
            return total.length;
          })       
          setTotalCancionesDiferentes(() => {
            const cancionesUnicas = new Set()

            parseResponse.message.forEach(el => {
              cancionesUnicas.add(el.cancionSugerida)
            })

            return cancionesUnicas.size
          })
        }        
      }
    }
    getUsers();
  },[]);

  const orderGuests = () => {
    const ordered = [...users].sort((a, b) => {
      if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
        return -1;
      }
      if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
        return 1;
      }
      return 0
    })
    setUsers(ordered)
  }

  return (
    <div className="App" style={{width: '100%'}}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{display: 'flex'}}>Invitado <ArrowDropDownIcon onClick={orderGuests}/></StyledTableCell>
            <StyledTableCell align="right">Asistencia</StyledTableCell>
            <StyledTableCell align="right">Preboda</StyledTableCell>
            <StyledTableCell align="right">Cancion</StyledTableCell>
            <StyledTableCell align="right">Alergias</StyledTableCell>
            <StyledTableCell align="right">Bus Ida</StyledTableCell>
            <StyledTableCell align="right">Bus Vuelta</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <StyledTableRow key={`${row.nombre}-${index}`}>
              <StyledTableCell component="th" scope="row">
                {row.nombre}
              </StyledTableCell>
              <StyledTableCell align="right">{row.asistencia}</StyledTableCell>
              <StyledTableCell align="right">{row.asistenciaPreboda}</StyledTableCell>
              <StyledTableCell align="right">{row.cancionSugerida}</StyledTableCell>
              <StyledTableCell align="right">{row.intolerancias}</StyledTableCell>
              <StyledTableCell align="right">{row.busIda}</StyledTableCell>
              <StyledTableCell align="right">{row.busVuelta}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div style={{width: 'auto', textAlign: 'left', paddingLeft: '20px', paddingRight: '20px'}}>
      <p><strong>Asistentes:</strong> {totalAsistencia}</p>
      <p><strong>Preboda: </strong>{totalPreboda}</p>
      <p><strong>Canciones distintas: </strong>{totalCancionesDiferentes}</p>
      <p><strong>Alergias: </strong>{totalIntolerancias.length}<br></br><strong>Tipos de alergias: </strong> 
        {!!totalIntolerancias?.int && totalIntolerancias.int.map((e, index) => {
          if(index < totalIntolerancias.int.length -1 ){
            e+=',';
          }
          return e
          })
        }
      </p>
      <p><strong>Bus de Ida: </strong>{totalBusIda}</p>
      <p><strong>Bus de Vuelta: </strong>{totalBusVuelta}</p>
    </div>    
    </div>
  );
}

export default App;
